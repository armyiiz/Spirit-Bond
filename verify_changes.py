
import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 400, "height": 800})
    page = context.new_page()

    try:
        print("Navigating to app...")
        page.goto("http://localhost:5173")
        time.sleep(2)

        # 1. Select Starter (if needed)
        if page.locator("text=เลือกคู่หูของคุณ").is_visible():
            print("Selecting starter...")
            page.click("button[data-testid^='starter-btn-']")
            page.wait_for_timeout(1000)

        # Check Idle State
        page.screenshot(path="verification_idle.png")
        print("Screenshot idle taken")

        # 2. Check Training
        print("Testing Training...")
        page.click('[data-testid="nav-btn-train"]')
        page.wait_for_timeout(1000)

        # Click Train button
        if page.locator("text=เริ่มฝึกฝน").is_visible():
             page.click("text=เริ่มฝึกฝน")
             page.wait_for_timeout(1000) # Wait for toast
             page.screenshot(path="verification_train_feedback.png")
             print("Screenshot training feedback taken")
        else:
             print("Cannot train (maybe low energy)")

        # Return to idle
        if page.locator("text=Close").is_visible():
            page.click("text=Close")
            page.wait_for_timeout(500)

        # 3. Check Battle
        print("Testing Battle...")
        page.click('[data-testid="nav-btn-battle"]')
        page.wait_for_timeout(2000)

        # Check HP Bars layout
        page.screenshot(path="verification_battle.png")
        print("Screenshot battle taken")

        # Check Nav Lock - Expect disabled
        print("Checking Nav Lock...")
        bag_btn = page.locator('[data-testid="nav-btn-bag"]')
        if bag_btn.is_disabled():
            print("PASS: Bag button is disabled during battle.")
        else:
            print("FAIL: Bag button is NOT disabled.")

        page.screenshot(path="verification_battle_nav_locked.png")

        # 4. End Battle (Flee)
        page.click('[data-testid="battle-flee-btn"]')
        page.wait_for_timeout(1000)
        page.screenshot(path="verification_flee.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="error_snapshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
