import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import * as joint from "@clientio/rappid";
import { layout as Layout } from "@clientio/rappid";
import "./App.css";
import "@clientio/rappid/rappid.css";
import { isLabeledStatement } from "typescript";

function App() {
  const canvas: any = useRef(null);
  const addButton: any = useRef(null);
  const saveButton: any = useRef(null);
  const inspector: any = useRef(null);
  const overlay1: any = useRef(null);
  const overlay2: any = useRef(null);
  const template: any = useRef(null);
  const content: any = useRef(null);
  const selecttemplate: any = useRef(null);

  const COLORS = [
    "#31d0c6",
    "#7c68fc",
    "#fe854f",
    "#feb663",
    "#ffffff",
    "#000000",
  ];
  const FONTCOLORS = ["#000000", "#0000ff", "#ff0000", "#00ff00", "#ffffff"];
  const [displayInspector, setDisplayInspector] = useState(false);
  const [displaTemplateSelect, setDisplaTemplateSelect] = useState(false);
  // const [currentSelectionModel, setCurrentSelectionModel] = useState("");
  const [options, setOption] = useState([
    { type: "template", name: "Tempale_1" },
    { type: "template", name: "Tempale_2" },
    { type: "template", name: "Tempale_3" },
    { type: "template", name: "Tempale_4" },
    { type: "template", name: "Tempale_5" },
    { type: "template", name: "Tempale_6" },
    { type: "template", name: "Tempale_7" },
  ]);

  useEffect(() => {
    // const graph = new joint.dia.Graph({}, { cellNamespace: shapes });
    // debugger;
    let currentSelectionModel="";
    const templateDictionary: { [x: string]: string } = {};
    const graph = new joint.dia.Graph();
    const tree = new Layout.TreeLayout({ graph: graph });
    const paper = new joint.dia.Paper({
      width: 600,
      height: 600,
      gridSize: 10,
      model: graph,
      perpendicularLinks: false,
      drawGrid: false,
      background: {
        color: "rgba(0, 255, 0, 0.0)",
      },
      // contentOptions: {
      //     padding: 0,
      //     allowNewOrigin: 'top'
      // },
      interactive: true,
    });

    const paperScroller = new joint.ui.PaperScroller({
      padding: 0,
      paper: paper,
      cursor: "crosshair",
      contentOptions: function (paperScroller) {
        var visibleArea = paperScroller.getVisibleArea();
        return {
          padding: {
            bottom: 10,
            top: 10,
            left: 10,
            right: 10,
          },
          allowNewOrigin: "any",
        };
      },
    });
    let timeOut: any = null;
    canvas.current.appendChild(paperScroller.el);

    addButton.current.onmousemove = (e: any) => {
      if (graph.toJSON().cells.length > 0) return;

      addButton.current.style.display = "block";

      if (timeOut !== null) {
        clearTimeout(timeOut);
      }
      timeOut = setTimeout(() => {
        addButton.current.style.display = "none";
      }, 1000);
    };
    canvas.current.onmousemove = (e: any) => {
      if (graph.toJSON().cells.length > 0) return;
      addButton.current.style.display = "block";

      if (timeOut !== null) {
        clearTimeout(timeOut);
      }
      timeOut = setTimeout(() => {
        addButton.current.style.display = "none";
      }, 1000);
    };
    // paperScroller.render().center();
    addButton.current.onclick = () => {
      // let label = prompt("Enter label");
      // generateTree(ELEMENT, elementZero.element, label || "");
      createZeroElement(ELEMENT);
    };

    saveButton.current.onclick = () => {
      saveDesign();
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

    selecttemplate.current.onchange = () => {
      if (currentSelectionModel) {
        fetch("template/template1.html" /*, options */)
          .then((response) => response.text())
          .then((html) => {
            content.current.src =`template/template1.html`;
          })
          .catch((error) => {
            console.warn(error);
          });
      }
    };
    const ELEMENT: joint.shapes.standard.Rectangle =
      new joint.shapes.standard.Rectangle({
        size: { height: 45, width: 100 },
        attrs: {
          body: {
            fill: COLORS[1],
            rx: 5,
            ry: 5,
            cursor: "pointer",
            strokeWidth: 2,
            stroke: "#6a6c8a",
          },
          label: {
            text: "Placeholder",
            fill: FONTCOLORS[0],
            "font-size": 14,
          },
        },
      });

    const link: joint.shapes.standard.Link = new joint.shapes.standard.Link({
      attrs: {
        line: {
          stroke: "#6a6c8a",
          strokeWidth: 2,
          pointerEvents: "none",
          targetMarker: {
            type: "path",
            d: "M 10 -5 0 0 10 5 z",
          },
        },
      },
      connector: { name: "rounded" },
    });

    const saveDesign = () => {
      let json = graph.toJSON();
      console.log(json);
    };

    const loadDesign = (jsonObject: string) => {
      var jsonstring = JSON.stringify(jsonObject);
      var graph = new joint.dia.Graph();
      graph.fromJSON(JSON.parse(jsonstring));
      graph.get("graphCustomProperty");
      graph.get("graphExportTime");
    };

    const layout = () => {
      tree.layout();
      paperScroller.adjustPaper();
    };
    let halo: any;
    const showHalo = (view: joint.dia.ElementView, opt: any) => {
      const model = view.model;

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
        type: "toolbar",
      });

      halo.removeHandle("clone");
      // halo.removeHandle('resize');
      halo.removeHandle("link");
      halo.removeHandle("fork");
      halo.removeHandle("unlink");
      halo.removeHandle("rotate");
      halo.removeHandle("remove");

      halo.addHandle({
        name: "linkaction",
        position: joint.ui.Halo.HandlePosition.S,
        icon: "img/link.png", 
      });
      halo.addHandle({
        name: "addaction",
        position: joint.ui.Halo.HandlePosition.S,
        icon: "img/plus.png",
      });
      halo.addHandle({
        name: "removeaction",
        position: joint.ui.Halo.HandlePosition.S,
        icon: "img/remove.png",
      });

      halo.on("action:removeaction:pointerdown", () => {
        // model.remove();
        // halo.remove();
        removeAction(view);
        halo.remove();
      });
      halo.on("action:addaction:pointerdown", () => {
        createSubHeader(view);
        halo.remove();
      });
      halo.on("action:linkaction:pointerdown", () => {
        currentSelectionModel=(model.id + "");
        console.log(model.id);
        setDisplaTemplateSelect(true);
        halo.remove();
      });

      halo.render();  
    };

    const removeAction = (view: any) => {
      console.log(view.model);
      let obje = graph.toJSON();
      let cells = obje.cells;
      console.log(JSON.stringify(cells));

      let linkArray = cells.filter((el: any) => el.type === "standard.Link");

      let removableElements = removeNode(linkArray, view?.model?.id);

      let allModels = view.model.collection.models.filter(
        (m: any) => removableElements.findIndex((e) => e === m.id) > -1
      );
      debugger;
      for (let i = 0; i < allModels.length; i++) {
        allModels[i].remove();
      }

      console.log(removableElements);
    };

    const removeNode = (linkArray: any[], cellId: string) => {
      let removableElements: any[] = [cellId];

      for (let i = 0; i < linkArray.length; i++) {
        if (linkArray[i].source.id === cellId) {
          removableElements = [
            ...removableElements,
            ...removeNode(linkArray, linkArray[i].target.id),
          ];
        }
      }
      return removableElements;
    };

    const showInspector = (
      view: joint.dia.ElementView,
      x: number,
      y: number
    ) => {
      const model = view.model;

      joint.ui.Inspector.create(inspector.current, {
        cell: model,
        inputs: {
          attrs: {
            body: {
              fill: {
                type: "color",
                options: [
                  { content: COLORS[0] },
                  { content: COLORS[1] },
                  { content: COLORS[2] },
                  { content: COLORS[3] },
                  { content: COLORS[4] },
                  { content: COLORS[5] },
                ],
                label: "Fill color",
                group: "color",
                index: 1,
              },
            },
            fill: {
              type: "color",
              options: [
                { content: FONTCOLORS[0] },
                { content: FONTCOLORS[1] },
                { content: FONTCOLORS[2] },
                { content: FONTCOLORS[3] },
                { content: FONTCOLORS[4] },
              ],
              label: "Font color",
              group: "color",
              index: 1,
            },

            label: {
              text: {
                label: "Label",
                type: "text",
                group: "text",
                index: 2,
              },
              "font-family": {
                type: "select",
                options: ["Arial", "Times New Roman", "Courier New"],
                label: "Font family",
                group: "text",
                index: 3,
              },
              "font-size": {
                type: "select",
                options: [
                  5, 10, 12, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30,
                ],
                multiple: false,
                overwrite: true,
                label: "Font size",
                group: "text",
                index: 3,
              },
            },
          },
          size: {
            width: {
              type: "range",
              min: 10,
              max: 500,
              label: "Width",
              group: "size",
              index: 2,
            },
            height: {
              type: "range",
              min: 10,
              max: 500,
              label: "Box size",
              group: "size",
              index: 2,
            },
          },
        },
        groups: {
          color: { label: "Color", index: 1 },
          size: { label: "Size", index: 2 },
          text: { label: "Style", index: 3 },
        },
      });
    };

    const createZeroElement = (element: any) => {
      element.position(0, 0).addTo(graph).findView(paper);
      layout();
      return element;
    };

    // const elementZero = { element: createZeroElement(ELEMENT_ZERO) };
    // generateTree( ELEMENT,elementZero.element,"First Child");
    var clickTimerId: any;
    const onElementClick = (view: any, event: any) => {
      console.log(event.originalEvent);
      console.log(view);
      // showHalo(view,{animation:true})
      if (clickTimerId) {
        // double click
        window.clearTimeout(clickTimerId);
        clickTimerId = null;
        onElementDblClick(view, {
          x: event.originalEvent.clientX /*-event.originalEvent.offsetX*/,
          y: event.originalEvent.clientY /*+event.originalEvent.offsetY*/,
        });
      } else {
        // single click
        clickTimerId = window.setTimeout(click, 200);
      }

      function click() {
        clickTimerId = null;
        showHalo(view, { animation: true });
      }
    };

    const onElementDblClick = (
      view: any,
      pointer: { x: number; y: number }
    ) => {
      setDisplayInspector(true);
      setTimeout(() => {
        showInspector(view, pointer.x, pointer.y);
      }, 10);
    };

    const createSubHeader = (view: any) => {
      console.log(view);
      const element = view.model;
      if (element.isElement()) {
        let label = prompt("Enter Name:");
        generateTree(ELEMENT, element, label || "");
      }
    };

    const addElement = (
      element: any,
      direction: string,
      parent: any,
      label: string
    ) => {
      const color = COLORS[2];

      const newElement = element
        .clone()
        .set("direction", direction)
        .attr("body/fill", color)
        .attr("label/text", label)
        .addTo(graph);
      link
        .clone()
        .set({
          source: { id: parent.id },
          target: { id: newElement.id },
        })
        .addTo(graph);

      return newElement;
    };

    const generateTree = (element: any, parent: any, label: string) => {
      label = label || "Placeholder";

      const directions = ["BR"];
      const direction = directions[0];
      const newElement = addElement(element, direction, parent, label);
      layout();
      return newElement;
    };
    paper.on({
      "element:pointerdown": onElementClick,
      "blank:pointerdown": paperScroller.startPanning,
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
            {options.map((o: any, i: number) => (
              <option key={i} value={i + 1}>
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
        <button className="saveButton" id="save" ref={saveButton}>
          Save
        </button>
      </div>
    </>
  );
}

export default App;
