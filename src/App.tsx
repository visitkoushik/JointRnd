import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import * as joint from "@clientio/rappid";
import { elementTools, layout as Layout } from "@clientio/rappid";
import "./App.css";
import "@clientio/rappid/rappid.css";
import {
  Cell,
  NaigationListItem,
  Navigation,
  Record,
  SavedObject,
  SiteNavigation,
  templateDictionary
} from "./DataTypes";
import JointService from "./JointService";
import LoadDesign from "./LoadDesign";

function App() {
  const canvas: any = useRef(null);
  const addButton: any = useRef(null);
  const saveButton: any = useRef(null);
  const loadButton: any = useRef(null);
  const inspector: any = useRef(null);
  const overlay1: any = useRef(null);
  const overlay2: any = useRef(null);
  const template: any = useRef(null);
  const content: any = useRef(null);
  const selecttemplate: any = useRef(null);
  const multiHeader = false;
  const DIRECTIONS = ["R", "BR", "B", "BL", "L", "TL", "T", "TR"];
  const POSITIONS = ["e", "se", "s", "sw", "w", "nw", "n", "ne"];
  const maxChild = 4;

  // let zeroElement: joint.shapes.standard.Circle | undefined = undefined;

  const [displayInspector, setDisplayInspector] = useState(false);
  const [displaTemplateSelect, setDisplaTemplateSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [options, setOption] = useState(JointService.allTemplates);

  const getLinkToolsView = (): joint.dia.ToolsView => {
    const verticesTool = new joint.linkTools.Vertices();
    const segmentsTool = new joint.linkTools.Segments();
    const sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
    const targetArrowheadTool = new joint.linkTools.TargetArrowhead();
    const sourceAnchorTool = new joint.linkTools.SourceAnchor();
    const targetAnchorTool = new joint.linkTools.TargetAnchor();
    const boundaryTool = new joint.linkTools.Boundary();
    const removeButton = new joint.linkTools.Remove();
    const toolsView: joint.dia.ToolsView = new joint.dia.ToolsView({
      tools: [
        verticesTool,
        segmentsTool,
        sourceArrowheadTool,
        targetArrowheadTool,
        sourceAnchorTool,
        targetAnchorTool,
        boundaryTool,
        removeButton
      ]
    });

    return toolsView;
  };

  const convertToSiteNavigation = (
    jsonObject: SavedObject
  ): SiteNavigation[] | SiteNavigation => {
    let sites: Cell[] = JointService.getSiteCell(jsonObject);
    let siteNav: SiteNavigation[] = [];
    sites.forEach((s: Cell) =>
      siteNav.push(JointService.createSiteNavigation(jsonObject, s))
    );

    return multiHeader ? siteNav : siteNav[0];
  };

  const openInspector = (view: any) => {
    setDisplayInspector(true);
    setTimeout(() => {
      JointService.showInspector(view, inspector);
    }, 10);
  };

  const textEditor = (view: any, evt: any) => {
    joint.ui.TextEditor.edit(evt.target, {
      cellView: view,
      textProperty: ["attrs", "label", "text"],
      annotationsProperty: ["attrs", "label", "annotations"]
    });
  };

  useEffect(() => {
    // const graph = new joint.dia.Graph({}, { cellNamespace: shapes });
    // debugger;

    let currentSelectionModel = "";
    let isremoveModeTree = false;

    const graph = new joint.dia.Graph();
    const tree = new Layout.TreeLayout({ graph: graph });

    const width = window.screen.availWidth - 100;
    const height = window.screen.availHeight - 300;

    const paper = new joint.dia.Paper({
      width: width,
      height: height,
      gridSize: 10,
      model: graph,
      perpendicularLinks: false,
      drawGrid: false,
      background: {
        color: "rgba(0, 255, 0, 0.0)"
      },
      // contentOptions: {
      //     padding: 0,
      //     allowNewOrigin: 'top'
      // },
      interactive: true
    });
    // const paperScroller = new joint.ui.PaperScroller({ autoResizePaper: true });
    const paperScroller = new joint.ui.PaperScroller({
      padding: 0,
      paper: paper,
      cursor: "crosshair",
      contentOptions: function (paperScroller) {
        var visibleArea = paperScroller.getVisibleArea();
        return {
          padding: {
            bottom: 10,
            top: 0,
            left: 0,
            right: 0
          },
          allowNewOrigin: "any"
        };
      }
    });
    let timeOut: any = null;
    canvas.current.appendChild(paperScroller.el);

    addButton.current.onmousemove = (e: any) => {
      if (graph.toJSON().cells.length > 0) return;

      // addButton.current.style.display = "block";

      // if (timeOut !== null) {
      //   clearTimeout(timeOut);
      // }
      // timeOut = setTimeout(() => {
      //   addButton.current.style.display = "none";
      // }, 1000);
    };
    canvas.current.onmousemove = (e: any) => {
      // if (graph.toJSON().cells.length > 0) return;
      // addButton.current.style.display = "block";
      // if (timeOut !== null) {
      //   clearTimeout(timeOut);
      // }
      // timeOut = setTimeout(() => {
      //     addButton.current.style.display = "none";
      // }, 1000);
    };

    // paperScroller.render().center();
    addButton.current.onclick = () => {
      // let label = prompt("Enter label");
      // generateTree(ELEMENT, elementZero.element, label || "");
      addButton.current.style.display = "none";
      if (!JointService.zeroElement) {
        JointService.zeroElement = JointService.createZeroElement(
          graph,
          JointService.getRootElement(),
          paper,
          width,
          height
        );
      }
      JointService.createHeader(
        graph,
        tree,
        paperScroller,
        JointService.zeroElement
      );
    };

    saveButton.current.onclick = () => {
      graph.set("template", templateDictionary);
      saveDesign();
    };

    loadButton.current.onchange = (e: any) => {
      var fr = new FileReader();
      fr.readAsText(e.target.files[0]);
      fr.onload = function () {
        const str: string = fr.result as string ;
        const m:SiteNavigation = JSON.parse(str) as SiteNavigation;
        LoadDesign.loadSite(
          m,
          graph,
          tree,
          paper,
          paperScroller,
          width,
          height
        );
        JointService.layout(tree, paperScroller);
      };
    };

    overlay1.current.onclick = (e: any) => {
      setDisplayInspector(false);
      setDisplaTemplateSelect(false);
    };
    overlay2.current.onclick = (e: any) => {
      setDisplayInspector(false);
      setDisplaTemplateSelect(false);
    };
    inspector.current.onclick = (e: any) => {
      e.stopPropagation();
    };

    template.current.onclick = (e: any) => {
      e.stopPropagation();
    };

    selecttemplate.current.onchange = (e: any) => {
      if (currentSelectionModel) {
        // debugger;
        setSelectedTemplate(e.target.value);
        templateDictionary[currentSelectionModel] = e.target.value;
        content.current.src = options[+(e.target.value + "") - 1].filename;
        // fetchPage(options[+(e.target.value + "") - 1].filename)
        //   .then((html: any) => {
        //     console.log(html);
        //     content.current.innerHTML = html;
        //   })
        //   .catch((e: any) => {});
      }
    };

    const saveDesign = () => {
      let json: SavedObject = graph.toJSON();
      let sitNav = convertToSiteNavigation(json);
      console.log(sitNav);
      JointService.layout(tree, paperScroller);
    };

    graph.on("change", function (cell, opt) {
      try {
        if (cell?.isLink() || !opt.textEditor) return;
        JointService.autoSize(cell, paper);
      } catch {}
    });
    const showHalo = (view: joint.dia.ElementView, opt: any) => {
      let halo: any;
      const model: any = view.model;

      if (opt && opt.animation) {
        paperScroller.scrollToElement(model, opt);
      } else {
        paperScroller.centerElement(model);
      }

      const getBoxContent = (model: any) => {
        return "";
      };

      halo = new joint.ui.Halo({
        cellView: view,
        tinyThreshold: 0,
        boxContent: getBoxContent(model),
        type: "toolbar"
      });

      halo.removeHandle("clone");
      // halo.removeHandle('resize');
      halo.removeHandle("link");
      halo.removeHandle("fork");
      halo.removeHandle("unlink");
      halo.removeHandle("rotate");
      halo.removeHandle("remove");

      if (JointService.getDepth(graph.toJSON(), model.id, 0) !== 1) {
        halo.addHandle({
          name: "linkaction",
          position: joint.ui.Halo.HandlePosition.S,
          icon: "img/link.png"
        });
      }
      if (JointService.getDepth(graph.toJSON(), model.id, 0) < maxChild) {
        halo.addHandle({
          name: "addaction",
          position: joint.ui.Halo.HandlePosition.S,
          icon: "img/plus.png"
        });
      }
      halo.addHandle({
        name: "removeaction",
        position: joint.ui.Halo.HandlePosition.S,
        icon: "img/remove.png"
      });

      halo.on("action:removeaction:pointerdown", () => {
        // model.remove();
        // halo.remove();
        removeAction(view);
        halo.remove();
        JointService.layout(tree, paperScroller);
      });
      halo.on("action:addaction:pointerdown", () => {
        JointService.createSubHeader(graph, tree, paperScroller, view);
        halo.remove();
      });
      halo.on("action:linkaction:pointerdown", () => {
        currentSelectionModel = model.id + "";
        console.log(model.id);
        selecttemplate.current.value =
          templateDictionary[currentSelectionModel] || "";
        content.current.src =
          options[+(selecttemplate.current.value + "") - 1]?.filename || "";
        setDisplaTemplateSelect(true);
        halo.remove();
      });

      halo.render();
    };

    const removeAction = (view: any) => {
      console.log(view.model);

      if (isremoveModeTree) {
        delete templateDictionary[view.model.id];
        view.model.remove();
        return;
      }
      let obje = graph.toJSON();
      let cells = obje.cells;
      console.log(JSON.stringify(cells));

      let linkArray = cells.filter((el: any) => el.type === "standard.Link");

      let removableElements = removeNode(linkArray, view?.model?.id);

      let allModels = view.model.collection.models.filter(
        (m: any) => removableElements.findIndex((e) => e === m.id) > -1
      );
      // debugger;
      for (let i = 0; i < allModels.length; i++) {
        allModels[i].remove();
      }

      console.log(removableElements);
    };

    const removeNode = (linkArray: any[], cellId: string) => {
      let removableElements: any[] = [cellId];
      delete templateDictionary[cellId];
      for (let i = 0; i < linkArray.length; i++) {
        if (linkArray[i].source.id === cellId) {
          removableElements = [
            ...removableElements,
            ...removeNode(linkArray, linkArray[i].target.id)
          ];
        }
      }
      return removableElements;
    };

    var clickTimerId: any;

    const onBlankClick = (e: any) => {
      paperScroller.startPanning(e);
      JointService.layout(tree, paperScroller);
      if (!multiHeader && graph.toJSON().cells.length > 0) return;
      if (addButton.current.style.display !== "block") {
        addButton.current.style.top = e.originalEvent.y + "px";
        addButton.current.style.left = e.originalEvent.x + "px";
        addButton.current.style.display = "block";
      } else {
        addButton.current.style.display = "none";
      }
    };
    const onElementClick = (view: any, event: any) => {
      addButton.current.style.display = "none";
      if (view.model === JointService.zeroElement) {
        return;
      }

      showHalo(view, { animation: true });
    };

    const onElementDblClick = (view: any, evt: any) => {
      textEditor(view, evt);
      JointService.autoSize(view.model, paper);
    };

    paper.on({
      "element:pointerdown": onElementClick,
      "element:pointerdblclick": onElementDblClick,
      "blank:pointerdown": onBlankClick
    });
    // graph.addCell(elementZero);

    paper.unfreeze();

    return () => {
      paperScroller.remove();
      paper.remove();
    };
  }, []);
  return (
    <>
      <div className="canvas" ref={canvas} />

      <div
        className="overlay"
        style={{ display: displayInspector ? "block" : "none" }}
        ref={overlay1}
      >
        <div className="inspector" ref={inspector} />
      </div>
      <div
        className="overlay"
        style={{ display: displaTemplateSelect ? "block" : "none" }}
        ref={overlay2}
      >
        <div className="template" ref={template}>
          <select className="selection" ref={selecttemplate}>
            <option value="" disabled>
              Select Template
            </option>
            {options.map((o: any, i: number) => (
              <option key={i} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          <iframe className="content" ref={content}></iframe>
        </div>
      </div>
      <button className="addButton" id="addHeader" ref={addButton}>
        +
      </button>

      <div className="menubar">
        <button className="menuButton" id="save" ref={saveButton}>
          Save
        </button>
        {/* <button className="menuButton" id="load" ref={loadButton}>
          Load
        </button> */}
        <div>
          <input
            type="file"
            name="inputfile"
            id="load"
            ref={loadButton}
            hidden
          />

          <label htmlFor="load" className="loadButton">
            Load
          </label>
        </div>
      </div>
    </>
  );
}

export default App;
