from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (using default Vite port 5173)
        page.goto("http://localhost:5173")

        # Wait for the page to load
        page.wait_for_timeout(3000)

        # Take a screenshot of the Main Menu (New Game / Continue)
        page.screenshot(path="verification/verification_main_menu.png")
        print("Screenshot of Main Menu taken")

        # If there's a "NEW GAME" button, click it
        new_game_btn = page.get_by_text("NEW GAME")
        continue_btn = page.get_by_text("CONTINUE")

        if new_game_btn.count() > 0 and new_game_btn.is_visible():
            new_game_btn.click()
            page.wait_for_timeout(1000)

            # Select a starter (e.g., the first one)
            page.screenshot(path="verification/verification_starter_selection.png")
            print("Screenshot of Starter Selection taken")

            # Click a starter (Buttons have logic direct to start game)
            pupper_btn = page.get_by_text("พัพเปอร์")
            if pupper_btn.count() > 0:
                 pupper_btn.click()
                 # Wait for game to load
                 page.wait_for_timeout(2000)

        elif continue_btn.count() > 0 and continue_btn.is_visible():
            continue_btn.click()
            page.wait_for_timeout(2000)

        # Now we should be in the Game Loop (Idle View)
        page.screenshot(path="verification/verification_game_idle.png")
        print("Screenshot of Game Idle taken")

        # Test Sleep Mode (Care -> Sleep)
        # Use localized label "ดูแล"
        care_btn = page.get_by_text("ดูแล")
        if care_btn.count() > 0:
            care_btn.click()
            page.wait_for_timeout(500)

            # Screenshot Care Menu
            page.screenshot(path="verification/verification_care_menu.png")

            # Click Sleep
            sleep_btn = page.get_by_text("นอนพักผ่อน")
            if sleep_btn.count() > 0:
                sleep_btn.click()
                page.wait_for_timeout(1000)

                # Should see Sleep Overlay
                page.screenshot(path="verification/verification_sleep_overlay.png")
                print("Screenshot of Sleep Overlay taken")

                # Wake up
                page.get_by_text("ตื่นนอน").click()
                page.wait_for_timeout(1000)

        # Test Evo Menu (Wiki)
        # Use localized label "วิวัฒนาการ"
        evo_btn = page.get_by_text("วิวัฒนาการ")
        if evo_btn.count() > 0:
            evo_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/verification_evo_menu.png")
            print("Screenshot of Evo Menu taken")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
