import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab_clusters extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_clusters',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension jupyterlab_clusters is activated!');
  }
};

export default extension;
