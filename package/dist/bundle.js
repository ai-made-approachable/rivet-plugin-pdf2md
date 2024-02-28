// src/nodes/PDF2MarkdownNode.ts
function PDF2MarkdownNode_default(rivet) {
  const nodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          path: ""
        },
        // This is the default title of your node.
        title: "PDF to Markdown",
        // This must match the type of your node.
        type: "PDF2Markdown",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 300
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.usePathInput) {
        inputs.push({
          id: "path",
          dataType: "string",
          title: "PDF file path"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "output",
          dataType: "string",
          title: "Output"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "PDF to Markdown",
        group: "PDF2MD",
        infoBoxBody: "This nodes reads a PDF file and converts it to markdown using the pdf2md library.",
        infoBoxTitle: "Converts a PDF documents to Markdown"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "filePathBrowser",
          dataKey: "path",
          useInputToggleDataKey: "usePathInput",
          label: "PDF File Path"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        ${data.path}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, context) {
      if (context.executor !== "nodejs") {
        throw new Error("This node can only be run using a nodejs executor.");
      }
      const path = rivet.getInputOrData(
        data,
        inputData,
        "path",
        "string"
      );
      let args;
      function splitArgs(args2) {
        const matcher = /(?:[^\s"]+|"[^"]*")+/g;
        return args2.match(matcher) || [];
      }
      const module = await import("../dist/nodeEntry.cjs");
      const convertPdfToMd = module.convertPdfToMd;
      const output = await convertPdfToMd(path);
      return {
        ["output"]: {
          type: "string",
          value: output
        }
      };
    }
  };
  const nodeDefinition = rivet.pluginNodeDefinition(
    nodeImpl,
    "PDF to Markdown"
  );
  return nodeDefinition;
}

// src/index.ts
var initializer = (rivet) => {
  const node = PDF2MarkdownNode_default(rivet);
  const plugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "rivet-plugin-pdf2md",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "PDF to Markdown",
    // Define all configuration settings in the configSpec object.
    configSpec: {},
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "pdf2md",
        label: "PDF2MD"
      }
    ],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(node);
    }
  };
  return plugin;
};
var src_default = initializer;
export {
  src_default as default
};
