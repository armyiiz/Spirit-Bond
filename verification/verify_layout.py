import time
from playwright.sync_api import sync_playwright, expect

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load App
        print("Loading app...")
        page.goto("http://localhost:5173")

        # Wait for loading
        page.wait_for_timeout(2000)

        # If starter selection is present (first run), select one
        # We use a generic locator for the first starter button if text fails
        if page.locator('[data-testid^="starter-btn-"]').first.is_visible():
             print("Selecting starter...")
             page.locator('[data-testid^="starter-btn-"]').first.click()
             page.wait_for_timeout(1000)

        # 2. Screenshot Idle State
        print("Capturing Idle State...")
        page.screenshot(path="verification/1_idle.png")

        # 3. Verify Care Menu
        print("Opening Care Menu...")
        page.get_by_test_id("nav-btn-care").click()
        page.wait_for_timeout(500)
        # Expect close button to be visible
        expect(page.get_by_test_id("console-close-btn")).to_be_visible()
        page.screenshot(path="verification/2_care.png")

        # Close Care
        page.get_by_test_id("console-close-btn").click()

        # 4. Verify Battle
        print("Starting Battle...")
        page.get_by_test_id("nav-btn-battle").click()
        page.wait_for_timeout(2000) # Wait for animation/logs
        expect(page.get_by_test_id("battle-flee-btn")).to_be_visible()
        page.screenshot(path="verification/3_battle.png")

        # Flee
        page.get_by_test_id("battle-flee-btn").click()
        page.wait_for_timeout(500)

        # 5. Verify Status Modal
        print("Opening Status Modal...")
        page.get_by_test_id("status-btn").click()
        page.wait_for_timeout(500)
        expect(page.get_by_test_id("status-modal")).to_be_visible()
        page.screenshot(path="verification/4_status.png")
        page.get_by_test_id("status-close-btn").click()

        browser.close()

if __name__ == "__main__":
    verify_layout()
