import { type } from "@testing-library/user-event/dist/type";
import React from "react";
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
  SiteNavigation
} from "./DataTypes";

interface JointServiceData {
  zeroElement: joint.shapes.standard.Circle | undefined;
  COLORS: string[];
  FONTCOLORS: string[];
  createZeroElement: (
    graph: any,
    element: any,
    paper: any,
    width: number,
    height: number
  ) => any;
  layout: (tree: any, paperScroller: any) => void;
  generateHeaderTree: (
    graph: any,
    tree: any,
    paperScroll: any,
    element: any,
    parent: any,
    label: string
  ) => any;
  addHeaderElement(
    graph: any,
    element: any,
    direction: string,
    parent: any,
    label: string
  ): any;
  getLink(color?: string): joint.shapes.standard.Link;
  getRootElement: () => joint.shapes.standard.Circle;
  getElement: () => joint.shapes.standard.Rectangle;
  createHeader: (
    graph: any,
    tree: any,
    paperScroll: any,
    element: any,
    label?: string
  ) => any;
  createSubHeader: (
    graph: any,
    tree: any,
    paperScroller: any,
    view: any,
    label?: string
  ) => any;
  generateTree(
    graph: any,
    tree: any,
    paperScroller: any,
    el: any,
    element: any,
    arg5: string
  ): any;
  createSiteNavigation: (jsonObject: SavedObject, site: Cell) => SiteNavigation;
  getAllImmidiateChilds(jsonObject: SavedObject, site: Cell): Navigation[];
  getDepth: (
    jsonObject: SavedObject,
    elementID: string,
    depth: number
  ) => number;
  getSiteCell: (jsonObject: SavedObject) => Cell[];
  convertToRecordJson: (
    jsonObject: SavedObject,
    templateDictionary: any
  ) => Record[];
  addElement: (
    graph: any,
    element: any,
    direction: string,
    parent: any,
    label: string
  ) => void;
  showInspector: (view: joint.dia.ElementView, inspector: any) => void;
  autoSize: (element: any, paper: any) => void;
  allTemplates: any[];
}

const JointService = () => {
  let jointService: JointServiceData = {} as JointServiceData;
  jointService.allTemplates = [
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
  ];
  jointService.zeroElement = undefined as
    | joint.shapes.standard.Circle
    | undefined;

  jointService.COLORS = [
    "#31d0c6",
    "#7c68fc",
    "#fe854f",
    "#feb663",
    "#ffffff",
    "#000000"
  ];
  jointService.FONTCOLORS = [
    "#000000",
    "#0000ff",
    "#ff0000",
    "#00ff00",
    "#ffffff"
  ];

  jointService.createZeroElement = (
    graph: any,
    element: any,
    paper: any,
    width: number,
    height: number
  ) => {
    let posX = width / 2 - 80;
    let posY = height / 4 - 50;

    element?.position(posX, posY).addTo(graph).findView(paper);
    // element?.position(0, 0).addTo(graph).findView(paper);

    // layout();
    return element;
  };
  jointService.layout = (tree: any, paperScroller: any) => {
    tree.layout();
    paperScroller.adjustPaper();
  };
  jointService.generateHeaderTree = (
    graph: any,
    tree: any,
    paperScroll: any,
    element: any,
    parent: any,
    label: string
  ) => {
    label = label || "Placeholder";

    const directions = ["B"];
    const direction = directions[0];
    const newElement = jointService.addHeaderElement(
      graph,
      element,
      direction,
      parent,
      label
    );
    jointService.layout(tree, paperScroll);

    return newElement;
  };

  jointService.addHeaderElement = (
    graph: any,
    element: any,
    direction: string,
    parent: any,
    label: string
  ) => {
    const color = jointService.COLORS[1];

    const newElement = element
      .clone()
      .set("direction", direction)
      .attr("body/fill", color)
      .attr("label/text", label)
      .addTo(graph);

    jointService
      .getLink("#00000000")
      .clone()
      .set({
        source: { id: parent.id },
        target: { id: newElement.id }
      })
      .addTo(graph);

    return newElement;
  };

  jointService.getLink = (color: string): joint.shapes.standard.Link => {
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
  jointService.getRootElement = () => {
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

  jointService.getElement = () => {
    const ELEMENT: joint.shapes.standard.Rectangle =
      new joint.shapes.standard.Rectangle({
        size: { height: 45, width: 100 },

        attrs: {
          body: {
            fill: jointService.COLORS[1],
            rx: 5,
            ry: 5,
            cursor: "pointer",
            strokeWidth: 2,
            stroke: "#6a6c8a"
          },
          label: {
            text: "Placeholder",
            fill: jointService.FONTCOLORS[0],
            "font-size": 14
          }
        }
      });
    return ELEMENT;
  };

  jointService.createHeader = (
    graph: any,
    tree: any,
    paperScroll: any,
    element: any,
    label?: string
  ): any => {
    let newelement: any;

    if (element.isElement()) {
      const el = jointService.getElement();

      newelement = jointService.generateHeaderTree(
        graph,
        tree,
        paperScroll,
        el,
        element,
        label || ""
      );
    }
    return newelement;
  };

  jointService.createSubHeader = (
    graph: any,
    tree: any,
    paperScroller: any,
    view: any,
    label?: string
  ) => {
    console.log(view);
    const element = !view.hasOwnProperty("vel") ? view : view.model;
    let subheader: any = undefined;
    if (element.isElement()) {
      const el = jointService.getElement();
      subheader = jointService.generateTree(
        graph,
        tree,
        paperScroller,
        el,
        element,
        label || ""
      );
    }
    return subheader;
  };

  jointService.createSiteNavigation = (
    jsonObject: SavedObject,
    site: Cell
  ): SiteNavigation => {
    let siteNavigation: SiteNavigation = {} as SiteNavigation;
    siteNavigation.SiteName = site.attrs?.label.text || "";

    let navlistitem: NaigationListItem[];
    navlistitem = jointService
      .getAllImmidiateChilds(jsonObject, site)
      .map((m: Navigation) => {
        let n: NaigationListItem = {} as NaigationListItem;
        n.Navigation = m;
        return n;
      });
    siteNavigation.Navigations = [...navlistitem];
    return siteNavigation;
  };

  jointService.getAllImmidiateChilds = (
    jsonObject: SavedObject,
    parent: Cell
  ): Navigation[] => {
    const navigationsList: Navigation[] = [];
    let parentLinks: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type === "standard.Link" && e.source?.id === parent.id
    );

    let elmentCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type === "standard.Rectangle"
    );
    for (let i = 0; i < parentLinks.length; i++) {
      for (let j = 0; j < elmentCells.length; j++) {
        if (elmentCells[j].id === parentLinks[i].target?.id) {
          let nav: Navigation = {} as Navigation;
          nav.Name = elmentCells[j].attrs?.label.text || "";
          nav.TemplateId = jsonObject.template[elmentCells[j].id] || null;

          let navlistitem: NaigationListItem[];
          navlistitem = jointService
            .getAllImmidiateChilds(jsonObject, elmentCells[j])
            .map((m: Navigation) => {
              let n: NaigationListItem = {} as NaigationListItem;
              n.Navigation = m;
              return n;
            });
          nav.ChildNavigations = [...navlistitem];

          navigationsList.push(nav);
        }
      }
    }

    return navigationsList;
  };

  jointService.getDepth = (
    jsonObject: SavedObject,
    elementID: string,
    depth: number
  ): number => {
    let depthRes = depth;
    let linkCells: Cell[] = jsonObject.cells.filter(
      (e: Cell) => e.type === "standard.Link"
    );

    for (let i = 0; i < linkCells.length; i++) {
      if (linkCells[i].target?.id === elementID) {
        return jointService.getDepth(
          jsonObject,
          linkCells[i].source?.id || "",
          depth + 1
        );
      }
    }
    return depthRes;
  };
  jointService.getSiteCell = (jsonObject: SavedObject): Cell[] => {
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

  jointService.convertToRecordJson = (
    jsonObject: SavedObject,
    templateDictionary: any
  ): Record[] => {
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

  jointService.addElement = (
    graph: any,
    element: any,
    direction: string,
    parent: any,
    label: string
  ):any => {
    const color = jointService.COLORS[2];

    const newElement = element
      .clone()
      .set("direction", direction)
      .attr("body/fill", color)
      .attr("label/text", label)
      .addTo(graph);

    jointService
      .getLink()
      .clone()
      .set({
        source: { id: parent.id },
        target: { id: newElement.id }
      })
      .addTo(graph);

      return newElement;
  };

  jointService.generateTree = (
    graph: any,
    tree: any,
    paperScroller: any,
    element: any,
    parent: any,
    label: string
  ): any => {
    label = label || "Placeholder";

    const directions = ["BR"];
    const direction = directions[0];
    const newElement = jointService.addElement(
      graph,
      element,
      direction,
      parent,
      label
    );
    jointService.layout(tree, paperScroller);
    return newElement;
  };

  jointService.showInspector = (
    view: joint.dia.ElementView,
    inspector: any
  ) => {
    const model = view.model;

    joint.ui.Inspector.create(inspector.current, {
      cell: model,
      inputs: {
        attrs: {
          body: {
            fill: {
              type: "color",
              options: [],
              label: "Fill color",
              group: "color",
              index: 1
            }
          },
          label: {
            fill: {
              type: "color",
              options: [],
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
  jointService.autoSize = (element: any, paper: any) => {
    var view = paper.findViewByModel(element);
    var textVel = view.vel.findOne("text");
    // Use bounding box without transformations so that our auto-sizing works
    // even on e.g. rotated element.
    var bbox = textVel.getBBox();
    // 16 = 2*8 which is the translation defined via ref-x ref-y for our rb element.
    element.resize(
      Math.max(bbox.width + 16, element.attributes.size.width),
      Math.max(bbox.height + 16, element.attributes.size.height)
    );
  };

  return jointService;
};

export default JointService();
