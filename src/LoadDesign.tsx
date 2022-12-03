import {
  NaigationListItem,
  Navigation,
  SiteNavigation,
  templateDictionary
} from "./DataTypes";
import JointService from "./JointService";

interface LoadData {
    loadFile: (e: any,graph: any, tree: any, paper: any, paperScroller: any, width: number, height: number) => void;
  
}



const loadSite = (
    jsonObject: SiteNavigation,
    graph: any,
    tree: any,
    paper: any,
    paperScroller: any,
    width: number,
    height: number
  ): any => {
    if (!JointService.zeroElement) {
      JointService.zeroElement = JointService.createZeroElement(
        graph,
        JointService.getRootElement(),
        paper,
        width,
        height
      );
    }
    let newElement = JointService.createHeader(
      graph,
      tree,
      paperScroller,
      JointService.zeroElement,
      jsonObject.SiteName
    );
  
    JointService.autoSize(newElement, paper);
    loadSubHeader(
      jsonObject.Navigations,
      graph,
      tree,
      paper,
      paperScroller,
      newElement,
      width,
      height
    );

    return newElement;
  };

  //   Name:string,
  //   TemplateId:number|null,
  //   ChildNavigations:NaigationListItem[]
  const loadSubHeader = (
    navigation: NaigationListItem[],
    graph: any,
    tree: any,
    paper: any,
    paperScroller: any,
    parent: any,
    width: number,
    height: number
  ): any => {
    navigation.forEach((n: NaigationListItem) => {
      let elem = JointService.createSubHeader(
        graph,
        tree,
        paperScroller,
        parent,
        n.Navigation.Name
      );
      if (n.Navigation.TemplateId) {
        templateDictionary[elem.id] = n.Navigation.TemplateId;
      }
      if (n.Navigation.ChildNavigations?.length > 0) {
        loadSubHeader(
          n.Navigation.ChildNavigations,
          graph,
          tree,
          paper,
          paperScroller,
          elem,
          width,
          height
        );
      }
      JointService.autoSize(elem, paper);
    });
  };





const LoadDesign = (): LoadData => {
  const loadDesign: LoadData = {} as LoadData;
  loadDesign.loadFile = (
    e: any,
    graph: any,
    tree: any,
    paper: any,
    paperScroller: any,
    width: number,
    height: number
  ) :void=> {
    var fr = new FileReader();
    fr.readAsText(e.target.files[0]);
    fr.onload = function () {
      const str: string = fr.result as string;
      const loadJson: any = JSON.parse(str) ;
      let site:SiteNavigation[]=[];
      if(!Array.isArray(loadJson)){
        site=[loadJson]
      }
      else{
        site=[...loadJson];
      }
      site.forEach((m:SiteNavigation)=>{
        loadSite(m, graph, tree, paper, paperScroller, width, height);
      })
    
      JointService.layout(tree, paperScroller);
    };
  };
  
  return loadDesign;
};

export default LoadDesign();
