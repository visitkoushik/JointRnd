import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import * as joint from "@clientio/rappid";
import { elementTools, layout as Layout } from "@clientio/rappid";
import "./App.css";
import "@clientio/rappid/rappid.css";
import { Cell, NaigationListItem, Navigation, Record, SavedObject, SiteNavigation } from "./DataTypes";

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
  const templateDictionary: { [x: string]: any } = {};
  const multiHeader=false;
  const DIRECTIONS = ["R", "BR", "B", "BL", "L", "TL", "T", "TR"];
  const POSITIONS = ["e", "se", "s", "sw", "w", "nw", "n", "ne"];

  let zeroElement: joint.shapes.standard.Circle | undefined = undefined;
  const COLORS = [
    "#31d0c6",
    "#7c68fc",
    "#fe854f",
    "#feb663",
    "#ffffff",
    "#000000"
  ];
  const FONTCOLORS = ["#000000", "#0000ff", "#ff0000", "#00ff00", "#ffffff"];
  const [displayInspector, setDisplayInspector] = useState(false);
  const [displaTemplateSelect, setDisplaTemplateSelect] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [options, setOption] = useState([
    {
      type: "template",
      name: "Tempale_1",
      id: 1,
      filename: "template/template1.html"
    },
    {
      type: "template",
      name: "Tempale_2",
      id: 2,
      filename: "template/template2.html"
    },
    {
      type: "template",
      name: "Tempale_3",
      id: 3,
      filename: "template/template3.html"
    },
    {
      type: "template",
      name: "Tempale_4",
      id: 4,
      filename: "template/template4.html"
    },
    {
      type: "template",
      name: "Tempale_5",
      id: 5,
      filename: "template/template5.html"
    },
    {
      type: "template",
      name: "Tempale_6",
      id: 6,
      filename: "template/template6.html"
    },
    {
      type: "template",
      name: "Tempale_7",
      id: 7,
      filename: "template/template7.html"
    }
  ]);

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

  const getLink = (color?: string) => {
    const LINK: joint.shapes.standard.Link = new joint.shapes.standard.Link({
      attrs: {
        line: {
          stroke: color || "#6a6c8a",
          strokeWidth: 2,
          pointerEvents: "none",
          targetMarker: {
            type: "path",
            d: "M 10 -5 0 0 10 5 z"
          }
        }
      },
      connector: { name: "rounded" }
    });

    return LINK;
  };
  const getRootElement = () => {
    const ELEMENT: joint.shapes.standard.Circle =
      new joint.shapes.standard.Circle({
        size: { height: 4, width: 4 },

        attrs: {
          body: {
            fill: "#00000000",
            rx: 5,
            ry: 5,
            cursor: "pointer",
            strokeWidth: 1,
            stroke: "#00000000"
          },
          label: {
            text: "",
            fill: "00000000",
            "font-size": 0
          }
        }
      });
    return ELEMENT;
  };
  const getElement = () => {
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
            stroke: "#6a6c8a"
          },
          label: {
            text: "Placeholder",
            fill: FONTCOLORS[0],
            "font-size": 14
          }
        }
      });
    return ELEMENT;
  };


  const convertToSiteNavigation = (
    jsonObject: SavedObject
  ): SiteNavigation[]|SiteNavigation => {
     let sites: Cell[] = getSiteCell(jsonObject);
    let siteNav: SiteNavigation[]=[];
    sites.forEach((s: Cell) =>
      siteNav.push(createSiteNavigation(jsonObject, s))
    );
   
    return multiHeader?siteNav:siteNav[0];
  };

  const createSiteNavigation = (
    jsonObject: SavedObject,
    site: Cell
  ): SiteNavigation => {
    let siteNavigation: SiteNavigation = {} as SiteNavigation;
    siteNavigation.SiteName = site.attrs?.label.text || "";
    
    let navlistitem: NaigationListItem[];
    navlistitem  = getAllImmidiateChilds(jsonObject,site).map((m:Navigation)=>{
        let n:NaigationListItem = {} as NaigationListItem;
        n.Navigation=m;
        return n
    })
    siteNavigation.Navigations=[...navlistitem];
    return siteNavigation;
  };

  const getAllImmidiateChilds=(jsonObject: SavedObject,parent:Cell):Navigation[]=>{
    const navigationsList:Navigation[]=[];
    let parentLinks: Cell[] = jsonObject.cells.filter((e: Cell) => 
    e.type === "standard.Link" && e.source?.id === parent.id);

    let elmentCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type === "standard.Rectangle" 
    );
    for(let i=0;i<parentLinks.length;i++){
      for(let j=0;j<elmentCells.length;j++){
            if(elmentCells[j].id === parentLinks[i].target?.id){
              let nav:Navigation={} as Navigation;
              nav.Name=elmentCells[j].attrs?.label.text||"";
              nav.TemplateId=jsonObject.template[elmentCells[j].id]||null;


              let navlistitem: NaigationListItem[];
              navlistitem  = getAllImmidiateChilds(jsonObject,elmentCells[j]).map((m:Navigation)=>{
                  let n:NaigationListItem = {} as NaigationListItem;
                  n.Navigation=m;
                  return n
              })
              nav.ChildNavigations=[...navlistitem];
               

              navigationsList.push(nav);
            }
        }
    }

  
    return navigationsList;
  }


  const getSiteCell = (jsonObject: SavedObject): Cell[] => {
    debugger;
    let rootElement: Cell = jsonObject.cells.find(
      (e: Cell) => e.type === "standard.Circle"
    ) as Cell;
    let linkCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type === "standard.Link" && e.source?.id === rootElement.id
    );

    let siteCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => linkCells.findIndex((f: Cell) => f.target?.id === e.id) > -1
    ); 
    return siteCells;
  };

  const convertToRecordJson = (jsonObject: SavedObject): Record[] => {
    let record: Record[] = [];
    let linkCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type === "standard.Link"
    );
    let elmentCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type !== "standard.Link"
    );

    for (let i = 0; i < elmentCells.length; i++) {
      let currEle: Cell = elmentCells[i];
      let r: Record = {} as Record;
      r.SiteNavigationId = currEle.id;
      r.Name = currEle.attrs?.label.text || "";

      let index = linkCells.findIndex((f: Cell) => f.target?.id === currEle.id);
      if (index > -1) {
        r.ParentNavigationId = linkCells[index].source?.id || "";
      } else {
        r.ParentNavigationId = "";
      }
      if (templateDictionary[currEle.id])
        r.TemplateId = +templateDictionary[currEle.id];
      record.push(r);
    }
    return record;
  };
  const showInspector = (view: joint.dia.ElementView) => {
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
                { content: COLORS[5] }
              ],
              label: "Fill color",
              group: "color",
              index: 1
            }
          },
          label: {
            fill: {
              type: "color",
              options: [
                { content: FONTCOLORS[0] },
                { content: FONTCOLORS[1] },
                { content: FONTCOLORS[2] },
                { content: FONTCOLORS[3] },
                { content: FONTCOLORS[4] }
              ],
              label: "Font color",
              group: "color",
              index: 1
            },

            text: {
              label: "Label",
              type: "text",
              group: "text",
              index: 2
            },
            "font-family": {
              type: "select",
              options: ["Arial", "Times New Roman", "Courier New"],
              label: "Font family",
              group: "text",
              index: 3
            },
            "font-size": {
              type: "select",
              options: [5, 10, 12, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
              multiple: false,
              overwrite: true,
              label: "Font size",
              group: "text",
              index: 3
            }
          }
        },
        size: {
          width: {
            type: "range",
            min: 10,
            max: 500,
            label: "Width",
            group: "size",
            index: 2
          },
          height: {
            type: "range",
            min: 10,
            max: 500,
            label: "Box size",
            group: "size",
            index: 2
          }
        }
      },
      groups: {
        color: { label: "Color", index: 1 },
        size: { label: "Size", index: 2 },
        text: { label: "Style", index: 3 }
      }
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

            // bottom: visibleArea.height / 2,
            // top: visibleArea.height / 2,
            // left: visibleArea.width / 2,
            // right: visibleArea.width / 2
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
      if (!zeroElement) {
        zeroElement = createZeroElement(getRootElement());
      }
      createHeader(zeroElement);
    };

    saveButton.current.onclick = () => {
      graph.set("template", templateDictionary);
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

    const fetchPage = (url: string): any => {
      return fetch(url).then((response: any) => response.text());
    };

    const saveDesign = () => {
      let json: SavedObject = graph.toJSON();
      let sitNav = convertToSiteNavigation(json);
      console.log(sitNav);
      
    };

    const loadDesign = (jsonObject: SavedObject) => {
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
    const showHalo = (view: joint.dia.ElementView, opt: any) => {
      let halo: any;
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
        type: "toolbar"
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
        icon: "img/link.png"
      });
      halo.addHandle({
        name: "addaction",
        position: joint.ui.Halo.HandlePosition.S,
        icon: "img/plus.png"
      });
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
        layout();
      });
      halo.on("action:addaction:pointerdown", () => {
        createSubHeader(view);
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

    const createZeroElement = (element: any) => {
      let posX = width / 2 - 80;
      let posY = height / 4 - 50;

      element?.position(posX, posY).addTo(graph).findView(paper);
      // element?.position(0, 0).addTo(graph).findView(paper);

      // layout();
      return element;
    };

    const createHeader = (element: any) => {
      if (element.isElement()) {
        const el = getElement();

        generateHeaderTree(el, element, "");
      }
    };

    const createSubHeader = (view: any) => {
      console.log(view);
      const element = view.model;
      if (element.isElement()) {
        const el = getElement();
        generateTree(el, element, "");
      }
    };

    var clickTimerId: any;

    const onBlankClick = (e: any) => {
      paperScroller.startPanning(e);
      if (!multiHeader && graph.toJSON().cells.length > 0) return;
      if (addButton.current.style.display !== "block" ) {
        addButton.current.style.top = e.originalEvent.y + "px";
        addButton.current.style.left = e.originalEvent.x + "px";
        addButton.current.style.display = "block";
      } else {
        addButton.current.style.display = "none";
      }
 
    };
    const onElementClick = (view: any, event: any) => {
      addButton.current.style.display = "none";
      if (view.model === zeroElement) {
        return;
      }
      // showHalo(view,{animation:true})
      if (clickTimerId) {
        // double click
        window.clearTimeout(clickTimerId);
        clickTimerId = null;
        onElementDblClick(view);
      } else {
        // single click
        clickTimerId = window.setTimeout(() => {
          clickTimerId = null;
          showHalo(view, { animation: true });
        }, 200);
      }
    };

    const onElementDblClick = (view: any) => {
      setDisplayInspector(true);
      setTimeout(() => {
        showInspector(view);
      }, 10);
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

      getLink()
        .clone()
        .set({
          source: { id: parent.id },
          target: { id: newElement.id }
        })
        .addTo(graph);
    };

    const addHeaderElement = (
      element: any,
      direction: string,
      parent: any,
      label: string
    ) => {
      const color = COLORS[1];

      const newElement = element
        .clone()
        .set("direction", direction)
        .attr("body/fill", color)
        .attr("label/text", label)
        .addTo(graph);

      getLink("#00000000")
        .clone()
        .set({
          source: { id: parent.id },
          target: { id: newElement.id }
        })
        .addTo(graph);
    };

    const generateTree = (element: any, parent: any, label: string) => {
      label = label || "Placeholder";

      const directions = ["BR"];
      const direction = directions[0];
      const newElement = addElement(element, direction, parent, label);
      layout();
      return newElement;
    };

    const generateHeaderTree = (element: any, parent: any, label: string) => {
      label = label || "Placeholder";

      const directions = ["B"];
      const direction = directions[0];
      const newElement = addHeaderElement(element, direction, parent, label);
      layout();
      return newElement;
    };
    paper.on({
      "element:pointerdown": onElementClick,
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
        <button className="saveButton" id="save" ref={saveButton}>
          Save
        </button>
      </div>
    </>
  );
}

export default App;
