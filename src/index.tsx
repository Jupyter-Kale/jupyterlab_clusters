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

    get profiles(): string[] {
        return this._profiles;
    }
    set profiles(newopts: string[]) {
        this._profiles = newopts;
        this.stateChanged.emit(void 0);
    }

    get isConnected(): boolean {
        return this._isConnected;
    }
    set isConnected(newbool: boolean) {
        this._isConnected = newbool;
        this.stateChanged.emit(void 0);
    }

    private _location: string = 'localhost';
    private _profile: string = 'default';
    private _numEngines: number = 1;
    private _profiles: string[] = ['default', 'otherprof'];
    private _isConnected: boolean = false;
}

class ProfileSelect extends React.Component<Clusters.IModelProps> {
    constructor(props: Clusters.IModelProps) {
        super(props);
    }

    render(): React.ReactElement<any> {
        console.log("Rendering ProfileSelect")
        console.log("ProfileSelect has props:");
        console.log(this.props);

        let profiles: string[] = this.props.model.profiles;
        let opts: React.ReactElement<any>[] = [];

        for(let i = 0; i < profiles.length; i++) {
            let opt: string = profiles[i];
            opts.push(
                <option key={i} value={opt}>
                    {opt}
                </option>
            )
        }

        return (
            <select className='jp-Clusters-profile-select'>
                {opts}
            </select>
        )
    }
}

class ConnectButton extends React.Component<Clusters.IModelProps> {
    constructor(props: Clusters.IModelProps) {
        super(props);
        // Bind this for event handler
        // See https://stackoverflow.com/questions/36106384/reactjs-typescript-event-this-undefined
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    render(): React.ReactElement<any> {
        let buttonText: string = (
            this.props.model.isConnected ? 'Disconnect' : 'Connect'
        );
        return (
            <button
                className='jp-Clusters-connect-button'
                onClick={this.onButtonClick}
            >
                {buttonText}
            </button>
        )
    }

    onButtonClick(evt: React.MouseEvent<HTMLElement>): void {
        //TODO: Actually connect.
        this.props.model.isConnected = ! this.props.model.isConnected;
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

        let title: React.ReactElement<any> = (
            <h2 className='jp-Clusters-title'>IPyParallel Clusters</h2>
        )

        let locationInput: React.ReactElement<any> = (
            <div className='jp-Clusters-row-div'>
                <span className='jp-Clusters-leftspan'>
                    <label className='jp-Clusters-label'>
                        Location
                    </label>
                </span>
                <span className='jp-Clusters-rightspan'>
                    <input className='jp-Clusters-location-input' defaultValue={this.model.location} />
                </span>
            </div>
        );
        let profileSelect: React.ReactElement<any> = (
            <div className='jp-Clusters-row-div'>
                <span className='jp-Clusters-leftspan'>
                    <label className='jp-Clusters-label'>
                        Profile
                    </label>
                </span>
                <span className='jp-Clusters-rightspan'>
                    <ProfileSelect model={this.model} />
                </span>
            </div>
        );
        let numEnginesInput: React.ReactElement<any> = (
            <div className='jp-Clusters-row-div'>
                <span className='jp-Clusters-leftspan'>
                    <label className='jp-Clusters-label'>
                        # of Engines
                    </label>
                </span>
                <span className='jp-Clusters-rightspan'>
                <input type='number' className='jp-Clusters-numEngines-input' defaultValue={this.model.numEngines}/>
                </span>
            </div>
        );
        let connectButton: React.ReactElement<any> = (
            <div className='jp-Clusters-row-div'>
                <br />
                <span className='jp-Clusters-leftspan'>
                </span>
                <span className='jp-Clusters-rightspan'>
                    <ConnectButton model={this.model}/>
                </span>
            </div>
        );

        return (
            <div className='jp-Clusters-body'>
                <div className='jp-Clusters-header'>
                    {title}
                </div>

                <div className='jp-Clusters-content'>
                    {locationInput}
                    {profileSelect}
                    {numEnginesInput}
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
    interface IModelProps {
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
