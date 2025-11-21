from playwright.sync_api import sync_playwright
import time

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 375, 'height': 667} # Mobile viewport
        )
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for load
        page.wait_for_timeout(2000)

        # Check if we are at starter selection
        if page.get_by_text("เลือกคู่หูของคุณ").is_visible():
            print("Selecting Starter...")
            # Using test-id from StarterSelection.tsx
            # We pick the first starter (pupper)
            page.get_by_test_id("starter-btn-starter_pupper").click()
            page.wait_for_timeout(1000)

        print("Verifying Main Layout...")
        # Verify Status Strip
        if page.get_by_text("HP", exact=True).count() > 0:
             print("Status Strip found.")

        # Screenshot Idle Mode
        page.screenshot(path="verification/01_idle.png")
        print("Screenshot taken: 01_idle.png")

        # Switch to Care Mode
        print("Switching to Care Mode...")
        page.get_by_test_id("nav-btn-care").click()
        page.wait_for_timeout(500)
        page.screenshot(path="verification/02_care.png")
        print("Screenshot taken: 02_care.png")

        # Switch to Bag Mode
        print("Switching to Bag Mode...")
        page.get_by_test_id("nav-btn-bag").click()
        page.wait_for_timeout(500)
        page.screenshot(path="verification/03_bag.png")
        print("Screenshot taken: 03_bag.png")

        # Switch to Evo Mode
        print("Switching to Evo Mode...")
        page.get_by_test_id("nav-btn-evo").click()
        page.wait_for_timeout(500)
        page.screenshot(path="verification/04_evo.png")
        print("Screenshot taken: 04_evo.png")

        # Switch to Battle Mode
        print("Switching to Battle Mode...")
        page.get_by_test_id("nav-btn-battle").click()
        page.wait_for_timeout(2000) # Wait for battle start log
        page.screenshot(path="verification/05_battle.png")
        print("Screenshot taken: 05_battle.png")

        # Flee Battle
        if page.get_by_test_id("battle-flee-btn").is_visible():
            print("Fleeing battle...")
            page.get_by_test_id("battle-flee-btn").click()
            page.wait_for_timeout(1000)

        page.screenshot(path="verification/06_post_battle.png")
        print("Screenshot taken: 06_post_battle.png")

        browser.close()

if __name__ == "__main__":
    verify_ui()
