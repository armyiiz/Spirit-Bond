import asyncio
import aiohttp
import os
import shutil
import re
from pathlib import Path

# Configuration
SOURCE_DIR = "/tmp/file_attachments/ultra-sun-ultra-moon/"
DEST_DIR = "_SORTED_SPRITES"

# Mapping Logic
ELEMENT_MAPPING = {
    "TERRA": {"ground", "rock", "steel", "grass", "bug", "poison"},
    "AERO": {"electric", "flying", "psychic", "ghost"},
    "PYRO": {"fire", "fighting", "dragon"},
    "NEUTRAL": {"normal", "dark", "fairy"},
    "AQUA": {"water", "ice"}
}

# Priority List (Highest to Lowest)
PRIORITY_LIST = ["PYRO", "AQUA", "AERO", "TERRA", "NEUTRAL"]

# Counters
stats = {
    "PYRO": 0,
    "AQUA": 0,
    "AERO": 0,
    "TERRA": 0,
    "NEUTRAL": 0,
    "OTHERS": 0,
    "ERRORS": 0
}

async def fetch_pokemon_types(session, pokemon_id):
    """Fetches the types for a given pokemon ID from PokeAPI."""
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"
    try:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                types = [t['type']['name'] for t in data['types']]
                return types
            else:
                print(f"Error fetching ID {pokemon_id}: Status {response.status}")
                return None
    except Exception as e:
        print(f"Exception fetching ID {pokemon_id}: {e}")
        return None

def determine_element(types):
    """Determines the element based on types and priority."""
    if not types:
        return "OTHERS"

    # Check against Priority List
    for element in PRIORITY_LIST:
        target_types = ELEMENT_MAPPING.get(element, set())
        # Check if ANY of the pokemon's types map to this element
        for t in types:
            if t in target_types:
                return element

    return "OTHERS"

async def process_file(session, filename, cache):
    """Processes a single file: parse ID, fetch types (with cache), sort."""
    if not filename.endswith(".png"):
        return

    # Extract ID. Filenames look like "0001.png" or "0006-mega-x.png"
    # We take the leading digits.
    match = re.match(r"^(\d+)", filename)
    if not match:
        print(f"Skipping {filename}: No ID found.")
        return

    pokemon_id = int(match.group(1))

    # Check cache
    if pokemon_id in cache:
        types = cache[pokemon_id]
    else:
        types = await fetch_pokemon_types(session, pokemon_id)
        if types is not None:
            cache[pokemon_id] = types
        else:
            # If fetch fails, we can't sort properly. Use OTHERS? Or retry?
            # For this script, we'll log and move to ERRORS/OTHERS
            print(f"Could not retrieve types for {filename} (ID: {pokemon_id})")
            element = "OTHERS" # Or special folder

    if types:
        element = determine_element(types)
    else:
        element = "OTHERS"

    # Move/Copy file
    target_dir = os.path.join(DEST_DIR, element)
    os.makedirs(target_dir, exist_ok=True)

    src_path = os.path.join(SOURCE_DIR, filename)
    dst_path = os.path.join(target_dir, filename)

    try:
        shutil.copy2(src_path, dst_path)
        stats[element] = stats.get(element, 0) + 1
    except Exception as e:
        print(f"Error copying {filename}: {e}")
        stats["ERRORS"] += 1

async def main():
    # Create destination root
    if os.path.exists(DEST_DIR):
        shutil.rmtree(DEST_DIR)
    os.makedirs(DEST_DIR)

    # Get list of files
    try:
        files = os.listdir(SOURCE_DIR)
        files = [f for f in files if f.endswith(".png")]
        print(f"Found {len(files)} image files to process.")
    except FileNotFoundError:
        print(f"Source directory {SOURCE_DIR} not found!")
        return

    # Cache for ID -> Types mapping to avoid re-fetching for same species (e.g. 0006, 0006-mega)
    type_cache = {}

    async with aiohttp.ClientSession() as session:
        tasks = []
        # Create tasks
        for f in files:
            task = process_file(session, f, type_cache)
            tasks.append(task)

        # Run tasks (maybe in chunks to avoid hitting API rate limits too hard?)
        # PokeAPI is fairly generous, but 800 at once might be much.
        # Let's use a semaphore.
        semaphore = asyncio.Semaphore(50) # 50 concurrent requests

        async def sem_task(task):
            async with semaphore:
                await task

        await asyncio.gather(*(sem_task(t) for t in tasks))

    # Report
    print("\nProcessing Complete!")
    print("-" * 30)
    total_sorted = 0
    for element in PRIORITY_LIST + ["OTHERS", "ERRORS"]:
        count = stats.get(element, 0)
        print(f"{element}: {count} images")
        total_sorted += count
    print("-" * 30)
    print(f"Total processed: {total_sorted}")

if __name__ == "__main__":
    asyncio.run(main())
