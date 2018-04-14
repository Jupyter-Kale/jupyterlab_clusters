import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

// import {
//   map, toArray
// } from '@phosphor/algorithm';


import {
    ICommandPalette, VDomRenderer, VDomModel
} from '@jupyterlab/apputils';

// import {
//     Widget
// } from '@phosphor/widgets';

import '../style/index.css';

import * as React from 'react';

export
interface IClusters {
}

class ClustersModel extends VDomModel implements IClusters {
    constructor() {
        super();
    }

    get location(): string {
        return this._location;
    }
    set location(newloc: string) {
        this._location = newloc;
        this.stateChanged.emit(void 0);
    }

    get profile(): string {
        return this._profile;
    }
    set profile(newprof: string) {
        this._profile = newprof;
        this.stateChanged.emit(void 0);
    }

    get numEngines(): number {
        return this._numEngines;
    }
    set numEngines(newnum : number) {
        this._numEngines = newnum;
        this.stateChanged.emit(void 0);
    }

    get profile_options(): string[] {
        return this._profile_options;
    }
    set profile_options(newopts: string[]) {
        this._profile_options = newopts;
    }

    private _location: string = '';
    private _profile: string = 'default';
    private _numEngines: number = 1;
    private _profile_options: string[] = ['default', 'otherprof'];
}

class ProfileSelect extends React.Component<Clusters.IProfileSelectProps> {
    constructor(props: Clusters.IProfileSelectProps) {
        super(props);
    }

    render(): React.ReactElement<any> {
        console.log("Rendering ProfileSelect")
        console.log("ProfileSelect has props:");
        console.log(this.props);

        // options = [];

        // for(let option of this.props.model.profile_options) {
        //     options.push(
        //         <option value={option}>
        //             {option}
        //         </option>
        //     )
        // }

        let opts: React.ReactElement<any> = this.props.model.profile_options.map((opt: string) => {
            <option value={opt}>
                {opt}
            </option>
        });

        console.log("opts: ", opts);

        return (
            <select className='jp-Clusters-profile-select'>
                {opts}
            </select>
        )
    }
}

class Clusters extends VDomRenderer<ClustersModel> {
    constructor(options: Clusters.IOptions) {
        super();
        this.addClass('jp-Clusters');
    }

    protected render(): React.ReactElement<any> {
        if (!this.model) {
            return null;
        }

        let locationInput: React.ReactElement<any> = (
            <div className='jp-Clusters-location-div'>
                <input className='jp-Clusters-location-input' value={this.model.location} />
            </div>
        );
        let profileSelect: React.ReactElement<any> = (
            <div className='jp-Clusters-profile-div'>
                <ProfileSelect model={this.model} />
            </div>
        );
        let nEnginesInput: React.ReactElement<any> = (
            <div className='jp-Clusters-nEngines-div'>
                <input type='number' className='jp-Clusters-nEngines-input' />
            </div>
        );
        let connectButton: React.ReactElement<any> = (
            <div className='jp-Clusters-connect-div'>
                <button className='jp-Clusters-connect-button' />
            </div>
        );

        return (
            <div className='jp-Clusters-body'>
                <div className='jp-Clusters-content'>
                    {locationInput}
                    {profileSelect}
                    {nEnginesInput}
                    {connectButton}
                </div>
            </div>
        );
    }
}

namespace Clusters {
    export
    interface IOptions {
    }

    export
    interface IProfileSelectProps {
        // Just keep the Clusters model, which has the profiles
        model: ClustersModel
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
                const clusters = new Clusters(options);
                clusters.model = model;
                clusters.id = id;
                clusters.title.label = 'Clusters';
                clusters.title.closable = true;

                // Add to main area if not present
                if(!clusters.isAttached) {
                    app.shell.addToMainArea(clusters);
                    console.log("Clusters added to main area.");
                }

                // Focus panel
                app.shell.activateById(clusters.id);
                console.log("Clusters focused.");

                return clusters

            }
        });
        palette.addItem({command, category: 'HPC'});
        return model;
    };
};

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
