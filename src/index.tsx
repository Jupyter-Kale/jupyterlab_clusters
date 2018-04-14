import {
    JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
    ICommandPalette, VDomRenderer, VDomModel
} from '@jupyterlab/apputils';

import {
    Widget
} from '@phosphor/widgets';

import '../style/index.css';

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
    get profile(): string {
        return this._profile;
    }
    get numEngines(): number {
        return this._numEngines;
    }
    get profile_options(): string[] {
        return this._profile_options;
    }

    set location(newloc: string) {
        this._location = newloc;
        this.stateChanged.emit(void 0);
    }
    set profile(newprof: string) {
        this._profile = newprof;
        this.stateChanged.emit(void 0);
    }
    set numEngines(newnum : number) {
        this._numEngines = newnum;
        this.stateChanged.emit(void 0);
    }

    private _location: string = '';
    private _profile: string = 'default';
    private _numEngines: number = 1;
    private _profile_options: string[] = ['default', 'otherprof'];
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
                    <select className='jp-Clusters-profile-select'>
                    <option value={this.profile_options[0]}>
                        {this.profile_options[0]}
                    </option>
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
        dummy: any
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
                const clusters = new Clusters({});
                clusters.model = model;
                clusters.id = id;
                clusters.title.label = 'Clusters';
                clusters.title.closable = true;

                return clusters

                // Add to main area if not present
                if(!widget.isAttached) {
                    app.shell.addToMainArea(widget);
                    console.log("Clusters added to main area.");
                }

                // Focus panel
                app.shell.activateById(widget.id);
                console.log("Clusters focused.");
            };
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
