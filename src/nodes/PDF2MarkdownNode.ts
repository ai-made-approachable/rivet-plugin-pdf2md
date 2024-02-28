// **** IMPORTANT ****
// Make sure you do `import type` and do not pull in the entire Rivet core library here.
// Export a function that takes in a Rivet object, and you can access rivet library functionality
// from there.
import type {
  ChartNode,
  EditorDefinition,
  Inputs,
  InternalProcessContext,
  NodeBodySpec,
  NodeConnection,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Project,
  Rivet,
} from "@ironclad/rivet-core";

// This defines your new type of node.
export type PDF2MarkdownNode = ChartNode<
  "PDF2Markdown",
  PDF2MarkdownNodeData
>;

// This defines the data that your new node will store.
export type PDF2MarkdownNodeData = {
  /** The path to the python script to run. If unset, runs scripts/python-script.py */
  path: string;

  /** Takes in the script path using an input if true/. */
  usePathInput?: boolean;
};

// Make sure you export functions that take in the Rivet library, so that you do not
// import the entire Rivet core library in your plugin.
export default function (rivet: typeof Rivet) {
  // This is your main node implementation. It is an object that implements the PluginNodeImpl interface.
  const nodeImpl: PluginNodeImpl<PDF2MarkdownNode> = {
    // This should create a new instance of your node type from scratch.
    create(): PDF2MarkdownNode {
      const node: PDF2MarkdownNode = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId<NodeId>(),

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
          width: 300,
        },
      };
      return node;
    },

    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(
      data: PDF2MarkdownNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.usePathInput) {
        inputs.push({
          id: "path" as PortId,
          dataType: "string",
          title: "PDF file path",
        });
      }

      return inputs;
    },

    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(
      _data: PDF2MarkdownNodeData,
      _connections: NodeConnection[],
      _nodes: Record<NodeId, ChartNode>,
      _project: Project
    ): NodeOutputDefinition[] {
      return [
        {
          id: "output" as PortId,
          dataType: "string",
          title: "Output",
        },
      ];
    },

    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "PDF to Markdown",
        group: "PDF2MD",
        infoBoxBody:
          "This nodes reads a PDF file and converts it to markdown using the pdf2md library.",
        infoBoxTitle: "Converts a PDF documents to Markdown",
      };
    },

    // This function defines all editors that appear when you edit your node.
    getEditors(
      _data: PDF2MarkdownNodeData
    ): EditorDefinition<PDF2MarkdownNode>[] {
      return [
        {
          type: "filePathBrowser",
          dataKey: "path",
          useInputToggleDataKey: "usePathInput",
          label: "PDF File Path",
        },
      ];
    },

    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(
      data: PDF2MarkdownNodeData
    ): string | NodeBodySpec | NodeBodySpec[] | undefined {
      return rivet.dedent`
        ${data.path}
      `;
    },

    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(
      data: PDF2MarkdownNodeData,
      inputData: Inputs,
      context: InternalProcessContext
    ): Promise<Outputs> {
      if (context.executor !== "nodejs") {
        throw new Error("This node can only be run using a nodejs executor.");
      }

      const path = rivet.getInputOrData(
        data,
        inputData,
        "path",
        "string"
      );

      let args: string[];

      function splitArgs(args: string): string[] {
        const matcher = /(?:[^\s"]+|"[^"]*")+/g;
        return args.match(matcher) || [];
      }

      // IMPORTANT
      // It is important that you separate node-only plugins into two separately bundled parts:
      // 1. The isomorphic bundle, which contains the node definition and all the code here
      // 2. The node bundle, which contains the node entry point and any node-only code
      // You are allowed to dynamically import the node entry point from the isomorphic bundle (in the process function)
      const module = await import("../nodeEntry");
      const convertPdfToMd = module.convertPdfToMd;
      const output = await convertPdfToMd(path);

      return {
        ["output" as PortId]: {
          type: "string",
          value: output,
        },
      };
    },
  };

  // Once a node is defined, you must pass it to rivet.pluginNodeDefinition, which will return a valid
  // PluginNodeDefinition object.ˇ
  const nodeDefinition = rivet.pluginNodeDefinition(
    nodeImpl,
    "PDF to Markdown"
  );

  // This definition should then be used in the `register` function of your plugin definition.
  return nodeDefinition;
}
