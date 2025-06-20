// ==UserScript==
// @name        Twitch Channel Points QOL
// @description Hides & Renames Twitch Channel Point Rewards
// @author      Lone Destroyer
// @license     MIT
// @match       https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @version     1.9
// @namespace https://github.com/LoneDestroyer
// @downloadURL https://raw.githubusercontent.com/LoneDestroyer/Twitch-Channel-Points-QOL/main/Twitch-Channel-Points-QOL.user.js
// @updateURL https://raw.githubusercontent.com/LoneDestroyer/Twitch-Channel-Points-QOL/main/Twitch-Channel-Points-QOL.user.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Selectors ---
    const rewardsPanelSelector = '#channel-points-reward-center-body'; // Rewards Panel
    const rewardsBodySelector = '.reward-center__content'; // Rewards Center Content
    const rewardSelector = '.reward-list-item'; // Rewards Item
    const rewardTextSelector = '.reward-list-item > div:nth-child(1) > div:nth-child(2) > p'; // Reward Text
    const rewardsPanelFooterSelector = '.reward-center__content > div:nth-child(3) > div:nth-child(2)'; // Footer for Restore Rewards Button
    const rewardsDescriptionSelector = '.reward-center-body > div:nth-child(1) > div:nth-child(1) > p:nth-child(1)'; // Rewards Description

    // --- Power-Ups Selector ---
    function getPowerUpsTitleElement() {
        return Array.from(document.querySelectorAll('.tw-title')).find(
            powerUpsTitleEl => powerUpsTitleEl.textContent.trim().toLowerCase() === 'power-ups'
        );
    }

    // --- Icon mappings ---
    const iconMappings = {
        Steam: 'https://store.steampowered.com/favicon.ico',
        GOG: 'https://www.gog.com/favicon.ico',
        EA: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Electronic-Arts-Logo.svg',
        Microsoft: 'https://www.microsoft.com/favicon.ico',
        'Microsoft Store': 'https://www.microsoft.com/favicon.ico',
        'Windows 10': 'https://www.microsoft.com/favicon.ico',
        'Windows 11': 'https://www.microsoft.com/favicon.ico',
        Windows: 'https://www.microsoft.com/favicon.ico',
        Xbox: 'https://www.xbox.com/favicon.ico',
        EXPIRED: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Fluent_Emoji_flat_1f6ab.svg',
        ENDED: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Fluent_Emoji_flat_1f6ab.svg',
        Entry: 'https://cdn0.iconfinder.com/data/icons/travel-258/64/ticket_entry_pass_entrance_coupon_-512.png',
    };

    // Get removed rewards from localStorage
    function getRemovedRewards() {
        return JSON.parse(localStorage.getItem('removedRewards')) || [];
    }

    // Save removed rewards to localStorage
    function saveRemovedReward(rewardText) {
        const removedRewards = getRemovedRewards();
        if (!removedRewards.includes(rewardText)) {
            removedRewards.push(rewardText);
            localStorage.setItem('removedRewards', JSON.stringify(removedRewards));
        }
    }

    // Remove a reward from localStorage
    function removeRewardFromStorage(rewardText) {
        const removedRewards = getRemovedRewards();
        const updatedRewards = removedRewards.filter(text => text !== rewardText);
        localStorage.setItem('removedRewards', JSON.stringify(updatedRewards));
    }

    // Helper to set display for rewards by name (using original text)
    function setRewardsDisplay(rewardNames, displayValue) {
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            // Use original text if present, otherwise use current text (modified with icon)
            const rewardTextEl = rewardElement.querySelector(rewardTextSelector);
            let originalText = rewardElement.dataset.originalReward || (rewardTextEl ? rewardTextEl.textContent.trim() : "");
            if (rewardNames.includes(originalText)) {
                rewardElement.style.display = displayValue;
            }
        });
    }

    // Hide rewards based on localStorage
    function hideRemovedRewards() {
        const removedRewards = getRemovedRewards();
        setRewardsDisplay(removedRewards, 'none');
        // Hide Power-Ups if needed
        if (removedRewards.includes('Twitch Power-Ups')) {
            togglePowerUpsVisibility(true);
        }
    }

    // Restore a specific reward
    function restoreReward(rewardText) {
        removeRewardFromStorage(rewardText);
        if (rewardText === 'Twitch Power-Ups') {
            togglePowerUpsVisibility(false); // Show Power-Ups
        } else {
            setRewardsDisplay([rewardText], '');
        }
    }

    // Toggle visibility of the restore container
    function toggleRestoreContainer() {
        let restoreContainerEl = document.querySelector('#restore-container');
        if (restoreContainerEl) {
            restoreContainerEl.style.display = restoreContainerEl.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Add a "Restore Rewards" button to channel points footer
    function addRestoreRewardsButton() {
        const rewardsPanelFooterEl = document.querySelector(rewardsPanelFooterSelector);
        if (rewardsPanelFooterEl && !document.querySelector('#restore-rewards-button')) {
            const restoreRewardsButton = document.createElement('button');
            restoreRewardsButton.id = 'restore-rewards-button';
            restoreRewardsButton.className = 'ScCoreButton-sc-ocjdkq-0 kEIAKL'; // Twitch button classes
            restoreRewardsButton.style = `box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-green-13) 30%, transparent), 0 1px 4px rgba(0,0,0,0.12); margin-left: 10px`;

            // Button Label
            const restoreLabelInner = document.createElement('div');
            restoreLabelInner.setAttribute('data-a-target', 'tw-core-button-label-text');
            restoreLabelInner.className = 'Layout-sc-1xcs6mc-0 JckMc';

            // Clock Icon
            const restoreIconDiv = document.createElement('div');
            restoreIconDiv.className = 'Layout-sc-1xcs6mc-0 eynyeD';
            restoreIconDiv.innerHTML = `
            <div style="color: var(--color-green-13);" class="Layout-sc-1xcs6mc-0 eBsWTL">
                <div class="ScSvgWrapper-sc-wkgzod-0 suNfx tw-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                        <path fill="currentColor" d="M48 256c0-114.9 93.1-208 208-208c49.7 0 95.5 17.5 131.1 46.6l-39.8 39.8c-15.1 15.1-4.4 41 17 41H464c13.3 0 24-10.7 24-24V56c0-21.4-25.9-32.1-41-17l-39.6 39.6C370.5 46.7 317.2 24 256 24C119 24 8 135 8 272s111 248 248 248c132.3 0 240-107.7 240-240c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 105.9-86.1 192-192 192S48 361.9 48 256zm232-88v72c0 13.3 10.7 24 24 24h72c13.3 0 24-10.7 24-24s-10.7-24-24-24h-48v-48c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
                    </svg>
                </div>
            </div>`; // FA Clock icon (green)

            // Button text
            const restoreTextDiv = document.createElement('div');
            restoreTextDiv.className = 'Layout-sc-1xcs6mc-0 fHdBNk';
            restoreTextDiv.textContent = 'Restore';

            restoreIconDiv.appendChild(restoreTextDiv);
            const restoreLabelOuter = document.createElement('div');
            restoreLabelOuter.className = 'ScCoreButtonLabel-sc-s7h2b7-0 kaIUar';

            restoreLabelInner.appendChild(restoreIconDiv);
            restoreLabelOuter.appendChild(restoreLabelInner);
            restoreRewardsButton.appendChild(restoreLabelOuter);

            restoreRewardsButton.title = 'Restore Hidden Rewards';
            restoreRewardsButton.addEventListener('click', toggleRestoreContainer);

            rewardsPanelFooterEl.parentElement.appendChild(restoreRewardsButton);
        }
    }

    // Function to add a restore button to each hidden reward
    function addRestoreButtons() {
        const removedRewards = getRemovedRewards();

        // Create a container for restore buttons if it doesn't exist
        let restoreContainerEl = document.querySelector('#restore-container');
        if (!restoreContainerEl) {
            // Create the outer container
            const restoreContainerOuter = document.createElement('div');
            restoreContainerOuter.id = 'restore-container';
            restoreContainerOuter.style = `
                position: absolute; inset: auto auto 100% 0px; margin-right: 10px; width: 320px; height: 400px;
                background-color: var(--color-background-base) !important; padding: 10px; box-sizing: border-box;
                box-shadow: var(--shadow-elevation-2) !important; display: none;
                border-radius: var(--border-radius-large) !important;
            `;

            // Add a header to the outer container
            const restoreContainerHeader = document.createElement('div');
            restoreContainerHeader.textContent = 'Restore Hidden Rewards';
            restoreContainerHeader.style = `
                font-size: var(--font-size-4) !important; font-weight: var(--font-weight-semibold) !important;
                font-family: var(--font-display); text-align: left !important; display: flex;
                align-items: center; color: #efeffi; padding: 5px 0; border-radius: 5px 5px 0 0;}
            `;

            // Add a close button to the header
            const closeButton = document.createElement('button');
            closeButton.className = 'ScCoreButton-sc-ocjdkq-0 bhSCzT ScButtonIcon-sc-9yap0r-0 exrGQc';
            closeButton.setAttribute('aria-label', 'Close');
            closeButton.title = 'Close Restore Rewards Panel';

            const closeIconDiv = document.createElement('div');
            closeIconDiv.className = 'ButtonIconFigure-sc-1emm8lf-0 lnTwMD';

            const closeIcon = document.createElement('div');
            closeIcon.className = 'ScSvgWrapper-sc-wkgzod-0 kccyMt tw-svg';

            closeIcon.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="presentation">
                    <path d="M8.5 10 4 5.5 5.5 4 10 8.5 14.5 4 16 5.5 11.5 10l4.5 4.5-1.5 1.5-4.5-4.5L5.5 16 4 14.5 8.5 10z"></path>
                </svg>`; // Twitch close icon

            closeIconDiv.appendChild(closeIcon);
            closeButton.appendChild(closeIconDiv);

            const closeButtonOuter = document.createElement('div');
            closeButtonOuter.className = 'Layout-sc-1xcs6mc-0 iieUvQ';
            closeButtonOuter.style = `padding-left: 70px;`;
            closeButtonOuter.appendChild(closeButton);

            // On click closes the restore container
            closeButton.addEventListener('click', () => {
                restoreContainerOuter.style.display = 'none'; // Hide
            });

            restoreContainerHeader.appendChild(closeButtonOuter);
            restoreContainerOuter.appendChild(restoreContainerHeader);

            // Create the scrollable container for buttons
            const restoreButtonsContainer = document.createElement('div');
            restoreButtonsContainer.id = 'restore-buttons-container';
            restoreButtonsContainer.style = `
                max-height: calc(100% - 50px); max-width: calc(100%); overflow: auto;
                scrollbar-color: grey transparent; scrollbar-width: thin; display: flex;
                flex-direction: column; border-radius: 0 0 5px 5px;
                padding: 2px;
            `;

            restoreContainerOuter.appendChild(restoreButtonsContainer);

            // Append the outer container to the Rewards Body
            const rewardsBodyEl = document.querySelector(rewardsBodySelector);
            if (rewardsBodyEl) {
                rewardsBodyEl.parentElement.insertBefore(restoreContainerOuter, rewardsBodyEl);
            } else {
                document.body.appendChild(restoreContainerOuter); // Fallback if target div is not found
            }
        }

        // Adds restore buttons for each removed reward
        removedRewards.forEach(rewardText => {
            const restoreButtonsContainer = document.querySelector('#restore-buttons-container');
            if (!restoreButtonsContainer.querySelector(`.restore-reward-button[data-reward="${rewardText}"]`)) {
                const restoreButton = document.createElement('button');
                restoreButton.className = 'ScCoreButton-sc-ocjdkq-0 kEIAKL restore-reward-button';
                restoreButton.style = `
                    box-shadow: 0 0 0 2px color-mix(in srgb,${rewardText === 'Twitch Power-Ups'?'var(--color-blue-9)':'var(--color-green-13)'} 70%, transparent),0 1px 4px rgba(0, 0, 0, 0.12);
                    margin-left: 10px; justify-content: normal !important; margin: 4px 0; min-height: 32px;
                    min-width: 0; border: none; display: flex;
                `;
                restoreButton.title = `Restore: ${rewardText}`;
                restoreButton.dataset.reward = rewardText;

                // Build Twitch-style label structure
                const restoreButtonsOuter = document.createElement('div');
                restoreButtonsOuter.className = 'ScCoreButtonLabel-sc-s7h2b7-0 kaIUar';

                const restoreButtonsInner = document.createElement('div');
                restoreButtonsInner.setAttribute('data-a-target', 'tw-core-button-label-text');
                restoreButtonsInner.className = 'Layout-sc-1xcs6mc-0 JckMc';

                const iconAndText = document.createElement('div');
                iconAndText.className = 'Layout-sc-1xcs6mc-0 eynyeD';

                // Add icon and text
                const { iconHtml, displayText } = getRewardIconAndText(rewardText, iconMappings);
                const restoreButtonsIcon = document.createElement('span');
                restoreButtonsIcon.innerHTML = iconHtml;
                // Text
                const restoreButtonsText = document.createElement('div');
                restoreButtonsText.className = 'Layout-sc-1xcs6mc-0 fHdBNk';
                restoreButtonsText.textContent = displayText;
                // Assemble
                iconAndText.appendChild(restoreButtonsIcon);
                iconAndText.appendChild(restoreButtonsText);
                restoreButtonsInner.appendChild(iconAndText);
                restoreButtonsOuter.appendChild(restoreButtonsInner);
                restoreButton.appendChild(restoreButtonsOuter);

                restoreButton.addEventListener('click', () => {
                    restoreReward(rewardText);
                    restoreButton.remove(); // Remove the button after restoring
                });
                restoreButtonsContainer.insertBefore(restoreButton, restoreButtonsContainer.firstChild);
            }
        });
    }

    // Helper for remove buttons
    function styleRemoveButton(btn, color = 'rgba(0, 0, 0, 0.6)', hoverColor = 'rgba(0, 0, 0, 0.8)', extraStyle = {}) {
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="width: 16px; height: 16px;">
                <path fill="white" d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9-35.7 46.2-87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
            </svg>
        `;
        btn.style = `
            position: absolute; top: 5px; right: 5px; width: 20px; height: 20px;
            background-color: rgba(0, 0, 0, 0.6); color: #fff; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            z-index: 10; font-size: 12px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s, transform 0.2s;
        `;
        // Allow extra style overrides - provides flexibility
        for (const [k, v] of Object.entries(extraStyle)) {
            btn.style[k] = v;
        }
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = hoverColor;
            btn.style.transform = 'scale(1.1)';
            btn.title = 'Hide';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = color;
            btn.style.transform = 'scale(1)';
            btn.title = '';
        });
    }


    // Rename rewards based on the text content & Ability to remove the Power-Ups - Adds eye button to hide
    function updateRewards() {
        const rewardElements = document.querySelectorAll(rewardSelector);
        rewardElements.forEach(rewardElement => {
            const rewardTextEl = rewardElement.querySelector(rewardTextSelector);
            if (rewardTextEl) {
                let rewardName = rewardTextEl.textContent.trim();

                // Store the original text as a data attribute if not already set
                if (!rewardElement.dataset.originalReward) {
                    rewardElement.dataset.originalReward = rewardName;
                }

                // Add a "Remove" button
                if (!rewardElement.querySelector('.remove-reward-button')) {
                    const removeRewardButton = document.createElement('button');
                    removeRewardButton.className = 'remove-reward-button';
                    styleRemoveButton(removeRewardButton, 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)', {
                        position: 'absolute', top: '5px', right: '5px'
                    });
                    removeRewardButton.addEventListener('click', () => {
                        rewardElement.style.display = 'none'; // Hide the specific reward
                        saveRemovedReward(rewardElement.dataset.originalReward); // Save original to localStorage
                        addRestoreButtons(); // Update the restore list
                    });
                    rewardElement.style.position = 'relative';
                    rewardElement.appendChild(removeRewardButton);
                }
                // Rename rewards based on mappings
                const { iconHtml, displayText } = getRewardIconAndText(rewardName, iconMappings);
                if (iconHtml) {
                    rewardTextEl.innerHTML = `${iconHtml} ${displayText}`;
                }
            }
        });
    }

    // Hide / show Power-Ups
    function togglePowerUpsVisibility(hide) {
        const powerUpsEl = document.querySelector('#power-ups-style');
        if (hide) {
            if (!powerUpsEl) {
                const powerUpStyle = document.createElement('style');
                powerUpStyle.id = 'power-ups-style';
                powerUpStyle.textContent = `
                    .rewards-list > div:first-of-type,
                    .rewards-list [class*="bitsRewardListItem"] {
                        display: none !important;
                    }
                    .rewards-list > div {
                        padding-top: 0 !important;
                    }
                `;
                document.head.appendChild(powerUpStyle);
            }
            saveRemovedReward('Twitch Power-Ups'); // Add Power-Ups to removedRewards
        } else {
            if (powerUpsEl) {
                powerUpsEl.remove();
            }
            removeRewardFromStorage('Twitch Power-Ups'); // Remove Power-Ups from removedRewards
        }
    }

    // Ability to remove the Power-Ups - Adds eye button to hide
    function removePowerupButton() {
        const powerUpsTitleEl = getPowerUpsTitleElement();
        if (powerUpsTitleEl && !powerUpsTitleEl.querySelector('.remove-powerup-button')) {
            const removePowerupButton = document.createElement('button');
            removePowerupButton.className = 'remove-powerup-button';
            styleRemoveButton(removePowerupButton,'rgba(64, 64, 64, 0.6)','rgba(64, 64, 64, 0.8)',
                {
                    marginLeft: '8px', position: 'static', verticalAlign: 'middle', display: 'inline-flex'
                }
            );
            removePowerupButton.addEventListener('click', () => {
                togglePowerUpsVisibility(true); // Hide rewards
            });
            powerUpsTitleEl.appendChild(removePowerupButton);
        }
    }

    // Helper function for reward icon and display text
    function getRewardIconAndText(rewardText, iconMappings) {
        for (const [key, iconUrl] of Object.entries(iconMappings)) {
            if (rewardText.startsWith(key)) {
                const displayText = rewardText.replace(
                    new RegExp(`^${key}:?(?:\\s*(?:Key Giveaway:?|APP Key:?|Key:?))?\\s*`, 'i'),
                    ''
                ).trim();
                const iconHtml = `<img src="${iconUrl}" alt="${key}" style="width:16px; height:16px; vertical-align:middle; margin-right:4px;">`;
                return { iconHtml, displayText };
            }
        }
        return { iconHtml: '', displayText: rewardText };
    }

    // Converts URLs in the rewardsDescription to clickable links
    function linkifyDescription() {
        const rewardsDescripEl = document.querySelector(rewardsDescriptionSelector);
        if (rewardsDescripEl && rewardsDescripEl.childNodes.length === 1 && rewardsDescripEl.childNodes[0].nodeType === Node.TEXT_NODE) {
            const rewardsDectipText = rewardsDescripEl.textContent;
            const txt2UrlRegex = /(https?:\/\/[^\s]+)/g;
            if (txt2UrlRegex.test(rewardsDectipText)) {
                const txt2UrlHtml = rewardsDectipText.replace(txt2UrlRegex, url => `<a href="${url}" rewardsDescripEl="_blank" rel="noopener noreferrer">${url}</a>`);
                rewardsDescripEl.innerHTML = txt2UrlHtml;
            }
        }
    }

    // Function to observe the rewards panel
    function observeRewardsPanel() {
        const observer = new MutationObserver(() => {
            if (document.querySelector(rewardsPanelSelector)) {
                hideRemovedRewards(); // Hide rewards based on localStorage
                updateRewards(); // Hide and rename rewards
                removePowerupButton(); // Add button to hide powerups
                addRestoreButtons(); // Add restore buttons for hidden rewards
                addRestoreRewardsButton(); // Add the "Restore Rewards" button next to the target button
                linkifyDescription(); // Convert URLs in the rewards description to clickable links
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    // Wait until the page has fully loaded
    window.addEventListener('load', () => {
        observeRewardsPanel();
    });
})();