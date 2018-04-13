import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
    ICommandPalette, VDomRenderer, VDomModel
} from '@jupyterlab/apputils';

// import {
//     Widget
// } from '@phosphor/widgets';

import * as React from 'react';

import '../style/index.css';

export
interface IClusters {
}

class ClustersModel extends VDomModel implements IClusters {
    constructor() {
        super();
    }
}

class Clusters extends VDomRenderer<ClustersModel> {
    constructor(options: Clusters.IOptions) {
        super();
        this.addClass('jp-Clusters');

        // this.locationInput = document.createElement("input");
        // this.node.appendChild(this.locationInput);

        // this.passwordInput = document.createElement("input");
        // this.passwordInput.setAttribute("type", "password");
        // this.node.appendChild(this.passwordInput);

        // this.profileSelect = document.createElement("select");
        // this.node.appendChild(this.profileSelect);

        // this.nEnginesInput = document.createElement("input");
        // this.nEnginesInput.setAttribute("type", "number");
        // this.node.appendChild(this.nEnginesInput);

        // this.connectButton = document.createElement("button");
        // this.node.appendChild(this.connectButton);
    }

        protected render(): React.ReactElement<any> {
            if (!this.model) {
                return null;
            }

            let locationInput: React.ReactElement<any> = (
                <div className='jp-Clusters-location-div'>
                    <input className='jp-Clusters-location-input' />
                </div>
            )
            let passwordInput: React.ReactElement<any> = (
                <div className='jp-Clusters-password-div'>
                    <input type='password' className='jp-Clusters-password-input' />
                </div>
            )
            let profileSelect: React.ReactElement<any> = (
                <div className='jp-Clusters-profile-div'>
                    <select className='jp-Clusters-profile-select' />
                </div>
            )
            let nEnginesInput: React.ReactElement<any> = (
                <div className='jp-Clusters-nEngines-div'>
                    <input type='number' className='jp-Clusters-nEngines-input' />
                </div>
            )
            let connectButton: React.ReactElement<any> = (
                <div className='jp-Clusters-connect-div'>
                    <button className='jp-Clusters-connect-button' />
                </div>
            )

            return (
                <div className='jp-Clusters-body'>
                    <div className='jp-Clusters-content'>
                      //{locationInput}
                      //{passwordInput}
                      //{profileSelect}
                      //{nEnginesInput}
                      //{connectButton}
                    </div>
                </div>
            )
        }

    locationInput: HTMLInputElement;
    passwordInput: HTMLInputElement;
    profileSelect: HTMLSelectElement;
    nEnginesInput: HTMLInputElement;
    connectButton: HTMLButtonElement;
}

namespace Clusters {
    export
    interface IOptions {
    }

    export
    function activate(app: JupyterLab, palette: ICommandPalette): IClusters {
        console.log("Activate Clusters.");

        const model = new ClustersModel();
        let options: IOptions = {};

        const command: string = 'clusters:open';
        app.commands.addCommand(command, {
            label: 'Open Clusters Panel',
            execute: () => {
                const id = 'clusters';
                const callback = (item: Widget) => {
                    // Add to main area if not present
                    if(!widget.isAttached) {
                        app.shell.addToMainArea(widget);
                        console.log("Clusters added to main area.");
                    }

                    // Focus panel
                    app.shell.activateById(widget.id);
                    console.log("Clusters focused.");
                };
                const clusters = new Clusters({});
                clusters.model = model;
                clusters.id = id;
                clusters.title.label = 'Clusters';
                clusters.title.closable = true;

                return clusters
            }
        });
        palette.addItem({command, category: 'HPC'});
        return model;
    };
}

/**
 * Initialization data for the jupyterlab_clusters extension.
 */
const extension: JupyterLabPlugin<IClusters> = {
    id: 'jupyterlab_clusters',
    activate: Clusters.activate,
    requires: [ICommandPalette],
    autoStart: true
};

export default extension;
