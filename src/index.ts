// It is important that you only import types from @ironclad/rivet-core, and not
// any of the actual Rivet code. Rivet is passed into the initializer function as
// a parameter, and you can use it to access any Rivet functionality you need.
import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";

import PDF2MarkdownNode from "./nodes/PDF2MarkdownNode";
import HTML2MarkdownNode from "./nodes/HTML2MarkdownNode";
// A Rivet plugin must default export a plugin initializer function. This takes in the Rivet library as its
// only parameter. This function must return a valid RivetPlugin object.
const initializer: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const nodePDF = PDF2MarkdownNode(rivet);
  const nodeHTML = HTML2MarkdownNode(rivet);
  // The plugin object is the definition for your plugin.
  const plugin: RivetPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "docs2md",

    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Documents to Markdown",

    // Define all configuration settings in the configSpec object.
    configSpec: {},

    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "docs2md",
        label: "Document Conversion",
      },
    ],

    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(nodePDF);
      register(nodeHTML);
    },
  };

  // Make sure to return your plugin definition.
  return plugin;
};

// Make sure to default export your plugin.
export default initializer;
