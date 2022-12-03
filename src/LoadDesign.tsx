import { NaigationListItem, Navigation, SiteNavigation, templateDictionary } from "./DataTypes";
import JointService from "./JointService";

interface LoadData {
  loadSubHeader: (
    navigation: NaigationListItem[],
    graph: any,
    tree: any,
    paper: any,
    paperScroller: any,
    parent: any,
    width: number,
    height: number
  ) => any;
  loadSite: (
    jsonObject: SiteNavigation,
    graph: any,
    tree: any,
    paper: any,
    paperScroller: any,
    width: number,
    height: number
  ) => any;
}

const LoadDesign = () => {
  const loadDesign: LoadData = {} as LoadData;

  loadDesign.loadSite = (
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
    debugger
    JointService.autoSize(newElement, paper);
    loadDesign.loadSubHeader(jsonObject.Navigations,graph,tree,paper,paperScroller,newElement,width,height);
    
    return newElement;
  };

  //   Name:string,
  //   TemplateId:number|null,
  //   ChildNavigations:NaigationListItem[]
  loadDesign.loadSubHeader = (
    navigation: NaigationListItem[],
    graph: any,
    tree: any,
    paper: any,
    paperScroller: any,
    parent: any,
    width: number,
    height: number
  ): any => {
    navigation.forEach((n: NaigationListItem)=>{
        let elem= JointService.createSubHeader(
            graph,
            tree,
            paperScroller,
            parent,
            n.Navigation.Name
          );
          if(n.Navigation.TemplateId){
            templateDictionary[elem.id] = n.Navigation.TemplateId
          }
          if(n.Navigation.ChildNavigations?.length>0){
            loadDesign.loadSubHeader(n.Navigation.ChildNavigations,graph,
                tree,
                paper,
                paperScroller,
                elem,
                width,
                height)
          }
          JointService.autoSize(elem, paper);
    })
   
  };

  return loadDesign;
};

export default LoadDesign();
