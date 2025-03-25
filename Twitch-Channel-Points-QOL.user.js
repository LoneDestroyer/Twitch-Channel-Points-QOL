// ==UserScript==
// @name        Twitch Channel Points QOL
// @description Renames Steam/GOG/EA Key Giveaway rewards on Twitch (soon to be automated) and adds icons
// @author      Lone Destroyer
// @license     CC0
// @match       https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @version     1.0
// @namespace https://github.com/LoneDestroyer
// @downloadURL https://raw.githubusercontent.com/LoneDestroyer/Twitch-Channel-Points-QOL/main/Twitch-Channel-Points-QOL.user.js
// @updateURL https://raw.githubusercontent.com/LoneDestroyer/Twitch-Channel-Points-QOL/main/Twitch-Channel-Points-QOL.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Font Awesome library
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    }

    // Define the specific CSS selector for the reward
    const rewardSelector = 'div.Layout-sc-1xcs6mc-0.iqUbUe.reward-list-item';

    // Define the rewards panel selector
    const rewardsPanelSelector = 'div#channel-points-reward-center-body';

    // Function to get removed rewards from localStorage
    function getRemovedRewards() {
        return JSON.parse(localStorage.getItem('removedRewards')) || [];
    }

    // Function to save removed rewards to localStorage
    function saveRemovedReward(rewardText) {
        const removedRewards = getRemovedRewards();
        if (!removedRewards.includes(rewardText)) {
            removedRewards.push(rewardText);
            localStorage.setItem('removedRewards', JSON.stringify(removedRewards));
        }
    }

    // Function to hide rewards based on localStorage
    function hideRemovedRewards() {
        const removedRewards = getRemovedRewards();
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            const textElement = rewardElement.querySelector('div.Layout-sc-1xcs6mc-0.auOiD > p.CoreText-sc-1txzju1-0.javhvP');
            if (textElement && removedRewards.includes(textElement.textContent.trim())) {
                rewardElement.style.display = 'none';
            }
        });
    }

    // Function to restore a specific reward
    function restoreReward(rewardText) {
        const removedRewards = getRemovedRewards();
        const updatedRewards = removedRewards.filter(text => text !== rewardText);
        localStorage.setItem('removedRewards', JSON.stringify(updatedRewards));
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            const textElement = rewardElement.querySelector('div.Layout-sc-1xcs6mc-0.auOiD > p.CoreText-sc-1txzju1-0.javhvP');
            if (textElement && textElement.textContent.trim() === rewardText) {
                rewardElement.style.display = '';
            }
        });
    }

    // Toggle visibility of the restore container
    function toggleRestoreContainer() {
        let restoreContainer = document.querySelector('#restore-container');
        if (restoreContainer) {
            restoreContainer.style.display = restoreContainer.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Add a "Restore Rewards" button next to the specified button
    function addRestoreRewardsButton() {
        const targetButton = document.querySelector('.hPHdJk > div:nth-child(2)');
        if (targetButton && !document.querySelector('#restore-rewards-button')) {
            const restoreRewardsButton = document.createElement('button');
            restoreRewardsButton.id = 'restore-rewards-button';
            restoreRewardsButton.textContent = 'Restore Rewards';
            restoreRewardsButton.style = `
                background-color: var(--color-background-button-primary-default); color: #fff;
                border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;
            `;

            restoreRewardsButton.addEventListener('click', toggleRestoreContainer);
            targetButton.parentElement.appendChild(restoreRewardsButton);
        }
    }

    // Function to add a restore button to each hidden reward
    function addRestoreButtons() {
        const removedRewards = getRemovedRewards();

        // Create a container for restore buttons if it doesn't exist
        let restoreContainer = document.querySelector('#restore-container');
        if (!restoreContainer) {
            // Create the outer container
            const outerContainer = document.createElement('div');
            outerContainer.id = 'restore-container';
            outerContainer.style = `
                position: absolute; inset: auto auto 100% 0px; margin-right: 10px; width: 320px; height: 400px;
                background-color: #18181b; padding: 10px; box-sizing: border-box;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 0px 4px rgba(0, 0, 0, 0.4); display: none;
            `;

            // Add a header to the outer container
            const header = document.createElement('div');
            header.textContent = 'Restore Hidden Rewards';
            header.style = `
                font-size: 16px; font-weight: bold; text-align: left; display: flex;
                align-items: center; color: #efeffi; padding: 5px 0; border-radius: 5px 5px 0 0;
            `;

            // Add a close button to the header
            const closeButton = document.createElement('button');
            closeButton.className = 'ScCoreButton-sc-ocjdkq-0 kIbAir ScButtonIcon-sc-9yap0r-0 eSFFfM';
            closeButton.setAttribute('aria-label', 'Close');
            closeButton.style = `
                position: static; margin-left: auto; cursor: pointer;
            `;

            const closeIcon = document.createElement('div');
            closeIcon.className = 'ButtonIconFigure-sc-1emm8lf-0 buvMbr';
            closeIcon.innerHTML = `
                <div class="ScFigure-sc-wkgzod-0 fewniq tw-svg">
                    <svg width="20" height="20" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="presentation">
                        <path d="M8.5 10 4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z" fill="var(--color-fill-button-icon)"></path>
                    </svg>
                </div>`;
            closeButton.appendChild(closeIcon);

            // Add event listener to close the restore container & hover over to match Twitch style
            closeButton.addEventListener('click', () => {
                outerContainer.style.display = 'none'; //Hide
            });
            closeButton.addEventListener('mouseover', () => {
                closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            closeButton.addEventListener('mouseout', () => {
                closeButton.style.backgroundColor = 'transparent';
            });
            header.appendChild(closeButton);
            outerContainer.appendChild(header);

            // Create the scrollable container for buttons
            const restoreButtonsContainer = document.createElement('div');
            restoreButtonsContainer.id = 'restore-buttons-container';
            restoreButtonsContainer.style = `
                max-height: calc(100% - 50px); max-width: calc(100%); overflow: auto;
                scrollbar-color: grey transparent; scrollbar-width: thin; display: flex;
                flex-direction: column; background-color: #18181b; border-radius: 0 0 5px 5px;
                padding: 2px;
            `;

            outerContainer.appendChild(restoreButtonsContainer);

            // Append the outer container to the target div
            const targetDiv = document.querySelector('.EwYZh');
            if (targetDiv) {
                targetDiv.parentElement.insertBefore(outerContainer, targetDiv);
            } else {
                document.body.appendChild(outerContainer); // Fallback if target div is not found
            }
        }

        removedRewards.forEach(rewardText => {
            const restoreButtonsContainer = document.querySelector('#restore-buttons-container');
            if (!restoreButtonsContainer.querySelector(`.restore-reward-button[data-reward="${rewardText}"]`)) {
                const restoreButton = document.createElement('button');
                restoreButton.textContent = rewardText;
                restoreButton.className = 'restore-reward-button';
                restoreButton.dataset.reward = rewardText;
                restoreButton.style = `
                    margin: 2px 0; padding: 5px; height: 30px; background-color: #28a745;
                    color: #fff; border-radius: 3px; cursor: pointer; font-size: 14px;
                    width: 100%; box-sizing: border-box;
                `;
                restoreButton.addEventListener('click', () => {
                    restoreReward(rewardText);
                    restoreButton.remove(); // Remove the button after restoring
                });
                restoreButtonsContainer.insertBefore(restoreButton, restoreButtonsContainer.firstChild);
            }
        });
    }

    // Icon mappings for rewards
    const iconMappings = {
        Steam: 'https://store.steampowered.com/favicon.ico',
        GOG: 'https://www.gog.com/favicon.ico',
        EA: 'https://www.ea.com/assets/images/favicon.png'
    };

    // Renmae rewards based on the text content & add a "Remove" button
    function updateRewards() {  
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            const textElement = rewardElement.querySelector('div.Layout-sc-1xcs6mc-0.auOiD > p.CoreText-sc-1txzju1-0.javhvP');
            if (textElement) {
                let textContent = textElement.textContent.trim();
                // Add a "Remove" button
                if (!rewardElement.querySelector('.remove-reward-button')) {
                    const removeButton = document.createElement('button');
                    removeButton.className = 'remove-reward-button';
                    removeButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
                    removeButton.style = `
                        position: absolute; top: 5px; right: 5px; width: 20px; height: 20px;
                        background-color: rgba(0, 0, 0, 0.6); color: #fff; border-radius: 50%;
                        cursor: pointer; display: flex; align-items: center; justify-content: center;
                        z-index: 10; font-size: 12px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        transition: background-color 0.3s, transform 0.2s;
                    `;
                    removeButton.addEventListener('mouseover', () => {
                        removeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        removeButton.style.transform = 'scale(1.1)';
                        removeButton.title = 'Hide';
                    });
                    removeButton.addEventListener('mouseout', () => {
                        removeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                        removeButton.style.transform = 'scale(1)';
                        removeButton.title = '';
                    });
                    removeButton.addEventListener('click', () => {
                        rewardElement.style.display = 'none'; // Hide the specific reward
                        saveRemovedReward(textContent); // Save to localStorage
                        addRestoreButtons(); // Update the restore list
                    });
                    rewardElement.style.position = 'relative';
                    rewardElement.appendChild(removeButton);
                }
                // Rename rewards based on mappings
                for (const [key, iconUrl] of Object.entries(iconMappings)) {
                    if (textContent.startsWith(key)) {
                        textContent = textContent.replace(new RegExp(`^${key}(?: Key Giveaway)?\\s*`, 'i'), '').trim();
                        textElement.innerHTML = `<img src="${iconUrl}" alt="${key}" style="width:16px; height:16px; vertical-align:middle;"> ${textContent}`;
                        break;
                    }
                }
            }
        });
    }

    // Function to observe the rewards panel
    function observeRewardsPanel() {
        const observer = new MutationObserver(() => {
            const rewardsPanel = document.querySelector(rewardsPanelSelector);
            if (rewardsPanel) {
                hideRemovedRewards(); // Hide rewards based on localStorage
                updateRewards(); // Hide rewards when the panel is detected
                addRestoreButtons(); // Add restore buttons for hidden rewards
                addRestoreRewardsButton(); // Add the "Restore Rewards" button next to the target button
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