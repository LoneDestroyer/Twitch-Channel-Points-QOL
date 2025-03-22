// ==UserScript==
// @name        Twitch Channel Point QOL
// @description Renames Steam/GOG/EA Key Giveaway rewards on Twitch (soon to be automated) and adds icons
// @author      Lone Destroyer
// @license     CC0
// @match       https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @version     0.6
// @grant       GM_addStyle
// @namespace https://github.com/LoneDestroyer
// ==/UserScript==

(function() {
    'use strict';

    // Define the specific CSS selector for the reward
    const rewardSelector = 'div.Layout-sc-1xcs6mc-0.iqUbUe.reward-list-item';

    // Define the rewards panel selector
    const rewardsPanelSelector = 'div#channel-points-reward-center-body';

    // Function to rename rewards
    function renameRewards() {
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            const textElement = rewardElement.querySelector('div.Layout-sc-1xcs6mc-0.auOiD > p.CoreText-sc-1txzju1-0.javhvP');
            if (textElement) {
                let textContent = textElement.textContent.trim();
                // Handle Steam rewards
                if (/^Steam(?: Key Giveaway)?\s*(.*)/.test(textContent)) {
                    textContent = textContent.replace(/^Steam(?: Key Giveaway)?\s*/, '').trim();
                    textElement.innerHTML = `<img src="https://store.steampowered.com/favicon.ico" alt="Steam" style="width:16px; height:16px; vertical-align:middle;"> ${textContent}`;
                }
                // Handle GOG rewards
                else if (/^GOG(?: Key Giveaway)?\s*(.*)/.test(textContent)) {
                    textContent = textContent.replace(/^GOG(?: Key Giveaway)?\s*/, '').trim();
                    textElement.innerHTML = `<img src="https://www.gog.com/favicon.ico" alt="GOG" style="width:16px; height:16px; vertical-align:middle;"> ${textContent}`;
                }
                // Handle EA rewards
                else if (/^EA(?: Key Giveaway)?\s*(.*)/.test(textContent)) {
                    textContent = textContent.replace(/^EA(?: Key Giveaway)?\s*/, '').trim();
                    textElement.innerHTML = `<img src="https://www.ea.com/assets/images/favicon.png" alt="EA" style="width:16px; height:16px; vertical-align:middle;"> ${textContent}`;
                }
            }
        });
    }

    // Function to observe the rewards panel
    function observeRewardsPanel() {
        const observer = new MutationObserver(() => {
            const rewardsPanel = document.querySelector(rewardsPanelSelector);
            if (rewardsPanel) {
                renameRewards(); // Rename rewards when the panel is detected
            }
        });
        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Wait until the page has fully loaded
    window.addEventListener('load', () => {
        observeRewardsPanel();
    });
})();