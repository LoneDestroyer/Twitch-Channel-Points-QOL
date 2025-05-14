// ==UserScript==
// @name        Twitch Channel Points QOL
// @description Hides & Renames Twitch Channel Point Rewards
// @author      Lone Destroyer
// @license     MIT
// @match       https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @version     1.3
// @namespace https://github.com/LoneDestroyer
// @downloadURL https://raw.githubusercontent.com/LoneDestroyer/Twitch-Channel-Points-QOL/main/Twitch-Channel-Points-QOL.user.js
// @updateURL https://raw.githubusercontent.com/LoneDestroyer/Twitch-Channel-Points-QOL/main/Twitch-Channel-Points-QOL.user.js
// ==/UserScript==
/*
 Changelog:
 v1.3 - Supports Microsoft / Xbox Rewards
 v1.2 - Added hiding Power-Ups
 v1.1 - No longer imports font-awesome, uses SVG for the remove button
 v1.0 - Added hiding and restoring of buttons
 v0.5 - Initial release (renames rewards)
*/

(function() {
    'use strict';

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

    // Function to remove a reward from localStorage
    function removeRewardFromStorage(rewardText) {
        const removedRewards = getRemovedRewards();
        const updatedRewards = removedRewards.filter(text => text !== rewardText);
        localStorage.setItem('removedRewards', JSON.stringify(updatedRewards));
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

        // Hide Power-Ups if they are in the removedRewards
        if (removedRewards.includes('Twitch Power-Ups')) {
            togglePowerUpsVisibility(true);
        }
    }

    // Function to restore a specific reward
    function restoreReward(rewardText) {
        removeRewardFromStorage(rewardText);
        if (rewardText === 'Twitch Power-Ups') {
            togglePowerUpsVisibility(false); // Show Power-Ups
        } else {
            const rewardElements = document.querySelectorAll(rewardSelector);
            rewardElements.forEach(rewardElement => {
                const textElement = rewardElement.querySelector('div.Layout-sc-1xcs6mc-0.auOiD > p.CoreText-sc-1txzju1-0.javhvP');
                if (textElement && textElement.textContent.trim() === rewardText) {
                    rewardElement.style.display = '';
                }
            });
        }
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
                </div>`;// Twitch close icon
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

                // Set a different color for "Power-Ups" button
                restoreButton.style = `
                    margin: 2px 0; padding: 5px; height: 30px;
                    background-color: ${rewardText === 'Twitch Power-Ups' ? '#2850a7' : '#28a745'};
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
        EA: 'https://www.ea.com/assets/images/favicon.png',
        Microsoft: 'https://www.microsoft.com/favicon.ico',
        'Windows 10': 'https://www.microsoft.com/favicon.ico',
        'Windows 11': 'https://www.microsoft.com/favicon.ico',
        Windows: 'https://www.microsoft.com/favicon.ico',
        Xbox: 'https://www.xbox.com/favicon.ico',
    };

    // Rename rewards based on the text content & add a "Remove" button
    function updateRewards() {
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            const textElement = rewardElement.querySelector('div.Layout-sc-1xcs6mc-0.auOiD > p.CoreText-sc-1txzju1-0.javhvP');
            if (textElement) {
                let textContent = textElement.textContent.trim();
                // Add a "Remove" button
                if (!rewardElement.querySelector('.remove-reward-button')) {
                    const removeRewardButton = document.createElement('button');
                    removeRewardButton.className = 'remove-reward-button';
                    removeRewardButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 16px; height: 16px;">
                            <path fill="white" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9-35.7 46.2-87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                        </svg>`;// Font Awesome eye-slash icon
                    removeRewardButton.style = `
                        position: absolute; top: 5px; right: 5px; width: 20px; height: 20px;
                        background-color: rgba(0, 0, 0, 0.6); color: #fff; border-radius: 50%;
                        cursor: pointer; display: flex; align-items: center; justify-content: center;
                        z-index: 10; font-size: 12px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        transition: background-color 0.3s, transform 0.2s;`;
                    removeRewardButton.addEventListener('mouseover', () => {
                        removeRewardButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                        removeRewardButton.style.transform = 'scale(1.1)';
                        removeRewardButton.title = 'Hide';
                    });
                    removeRewardButton.addEventListener('mouseout', () => {
                        removeRewardButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                        removeRewardButton.style.transform = 'scale(1)';
                        removeRewardButton.title = '';
                    });
                    removeRewardButton.addEventListener('click', () => {
                        rewardElement.style.display = 'none'; // Hide the specific reward
                        saveRemovedReward(textContent); // Save to localStorage
                        addRestoreButtons(); // Update the restore list
                    });
                    rewardElement.style.position = 'relative';
                    rewardElement.appendChild(removeRewardButton);
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

    // Function to hide or show Power-Ups
    function togglePowerUpsVisibility(hide) {
        const powerUpsStyle = document.querySelector('#power-ups-style');
        if (hide) {
            if (!powerUpsStyle) {
                const style = document.createElement('style');
                style.id = 'power-ups-style';
                style.textContent = `
                    .rewards-list > div:first-of-type,
                    .rewards-list [class*="bitsRewardListItem"] {
                        display: none !important;
                    }
                    .rewards-list > div {
                        padding-top: 0 !important;
                    }
                `;
                document.head.appendChild(style);
            }
            saveRemovedReward('Twitch Power-Ups'); // Add Power-Ups to removedRewards
        } else {
            if (powerUpsStyle) {
                powerUpsStyle.remove();
            }
            removeRewardFromStorage('Twitch Power-Ups'); // Remove Power-Ups from removedRewards
        }
    }

    // Add an eye icon button to hide rewards
    function removePowerupButton() {
        const targetElement = document.querySelector('div.Layout-sc-1xcs6mc-0.josRc p.CoreText-sc-1txzju1-0.ScTitleText-sc-d9mj2s-0.sghpq.jYWWLJ.tw-title');
        if (targetElement && !targetElement.querySelector('.remove-powerup-button')) {
            const removePowerupButton = document.createElement('button');
            removePowerupButton.className = 'remove-powerup-button';
            removePowerupButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 16px; height: 16px;">
                <path fill="white" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9-35.7 46.2-87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
            </svg>`;// Font Awesome eye-slash icon
            removePowerupButton.style = `
                background-color: rgba(64, 64, 64, 0.6); color: #fff; border-radius: 50%;
                cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
                margin-left: 8px; width: 20px; height: 20px; font-size: 12px;
                box-shadow: 0 2px 4px rgba(64, 64, 64, 0.2); transition: background-color 0.3s, transform 0.2s;
                vertical-align: middle;`;
            removePowerupButton.addEventListener('mouseover', () => {
                removePowerupButton.style.backgroundColor = 'rgba(64, 64, 64, 0.8)';
                removePowerupButton.style.transform = 'scale(1.1)';
                removePowerupButton.title = 'Hide';
            });
            removePowerupButton.addEventListener('mouseout', () => {
                removePowerupButton.style.backgroundColor = 'rgba(64, 64, 64, 0.6)';
                removePowerupButton.style.transform = 'scale(1)';
                removePowerupButton.title = '';
            });
            removePowerupButton.addEventListener('click', () => {
                togglePowerUpsVisibility(true); // Hide rewards
            });
            targetElement.appendChild(removePowerupButton);
        }
    }

    // Function to observe the rewards panel
    function observeRewardsPanel() {
        const observer = new MutationObserver(() => {
            const rewardsPanel = document.querySelector(rewardsPanelSelector);
            if (rewardsPanel) {
                hideRemovedRewards(); // Hide rewards based on localStorage
                updateRewards(); // Hide and rename rewards
                removePowerupButton(); // Add button to hide powerups
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