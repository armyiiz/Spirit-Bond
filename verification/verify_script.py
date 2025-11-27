from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Access the app
        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for loading
        page.wait_for_timeout(5000)

        # Take a screenshot to debug state
        page.screenshot(path="verification/debug_start.png")
        print("Debug screenshot taken.")

        # 2. Check for Start Game/New Game if present
        if page.get_by_text("เริ่มเกมใหม่").is_visible():
             print("Starting new game...")
             page.get_by_text("เริ่มเกมใหม่").click()
             page.wait_for_timeout(1000)
             # Select starter
             page.locator("button").first.click()
             page.wait_for_timeout(1000)

        # If we are in game, we should see the Header or MonsterStage
        page.screenshot(path="verification/debug_ingame.png")

        # 3. Verify Shop Requirements (ActionConsole)
        print("Verifying Shop UI...")
        # Switch to Shop mode by clicking button with test id nav-btn-shop
        if page.get_by_test_id("nav-btn-shop").is_visible():
            page.get_by_test_id("nav-btn-shop").click()
            page.wait_for_timeout(1000)

            # Screenshot Shop
            page.screenshot(path="verification/shop_verification.png")
            print("Shop screenshot taken.")

            # Close Shop
            page.get_by_text("Close").click()
            page.wait_for_timeout(500)
        else:
            print("Shop button not visible!")

        # 4. Verify Battle Bag & Retreat (Battle UI)
        print("Verifying Battle UI...")
        # Switch to Explore -> Battle
        if page.get_by_test_id("nav-btn-explore").is_visible():
            page.get_by_test_id("nav-btn-explore").click()
            page.wait_for_timeout(1000)

            # Select first route
            # Wait for route list to appear
            if page.get_by_text("หุบเขาศิลาแลง").is_visible():
                page.get_by_text("หุบเขาศิลาแลง").click()
                page.wait_for_timeout(1000)

                # Take screenshot of Battle UI
                page.screenshot(path="verification/battle_ui.png")
                print("Battle UI screenshot taken.")

                # Click Pause/Bag button
                # The button has a Backpack icon. We can try to find it by SVG or its container class.
                # Or simpler: it is the first button in the bottom bar when active.
                # Let's try to click the button that toggles the bag.
                # It's the button with the backpack icon.

                # Since I can't easily select by icon, I'll select by the fact it is NOT the "Run" button.
                # The bottom bar has 2 buttons: Bag and Run.

                bag_btn = page.locator("button").filter(has_not_text="Run").filter(has_not_text="หนี").last
                if bag_btn.is_visible():
                    bag_btn.click()
                    page.wait_for_timeout(500)
                    page.screenshot(path="verification/battle_bag.png")
                    print("Battle Bag screenshot taken.")

                    # Close bag
                    page.get_by_text("Close (Resume)").click()
                else:
                    print("Could not find Bag button.")
            else:
                print("Could not find route.")
        else:
            print("Explore button not visible.")

        browser.close()

if __name__ == "__main__":
    verify_changes()
