/* Copyright(c) 2019-2020 Philip Mulcahy. */

"use strict";

const Vue = require('vue');

const KEY = 'azad_settings';

export function initialiseUi() {
    const vue_settings_app = new Vue({
        el: '#azad_settings',
        data: {
            checked_settings: []
        },
        watch: {
            checked_settings: function(new_settings: any) {
                const value = JSON.stringify(new_settings);
                const entry: Record<string, any> = {};
                entry[KEY] = value;
                chrome.storage.sync.set(
                    entry,
                    function() {
                        console.log('settings stored: ' + value);
                    }
                );
            }
        }
    });
    chrome.storage.sync.get(
        KEY,
        function(entries) {
            console.log('settings retrieved: ' + JSON.stringify(entries));
            vue_settings_app.checked_settings = JSON.parse(entries[KEY]);
        }
    );
}

export function getBoolean(
    key: string,
    default_value: boolean
): Promise<boolean> {
    return new Promise<boolean>(
        function( 
            resolve: (value?: boolean) => void,
            reject: (reason?: any) => void,
        ) {
            chrome.storage.sync.get(
                KEY,
                function(entries) {
                    console.log('settings retrieved: ' + JSON.stringify(entries));
                    const settings =  JSON.parse(entries[KEY]);
                    if (settings.includes(key)) {
                        try {
                            const result: boolean = <boolean>settings[key];
                            resolve(result);
                        } catch( ex ) {
                            reject(ex);
                        }
                    }
                    resolve(default_value);
                }
            );
        }
    );
}

