import * as joint from "@clientio/rappid";
import { Cell, SavedObject, SiteNavigation } from "./DataTypes";
import JointService from "./JointService";

interface SaveData {
  saveData: (
    graph: joint.dia.Graph<
      joint.dia.Graph.Attributes,
      joint.dia.ModelSetOptions
    >,
    multiHeader: boolean
  ) => void;
}

  const convertToSiteNavigation = (
    jsonObject: SavedObject,
    multiHeader: boolean
  ): SiteNavigation[] | SiteNavigation => {
    let sites: Cell[] = JointService.getSiteCell(jsonObject);
    let siteNav: SiteNavigation[] = [];
    sites.forEach((s: Cell) =>
      siteNav.push(JointService.createSiteNavigation(jsonObject, s))
    );

    return multiHeader ? siteNav : siteNav[0];
  };

const SaveToFile = (): SaveData => {
  let saveFile: SaveData = {} as SaveData;

  saveFile.saveData = (graph: joint.dia.Graph, multiHeader: boolean): void => {
    let json: SavedObject = graph.toJSON();
    let sitNav = convertToSiteNavigation(json, multiHeader);
    console.log(sitNav);

    let filename = "saved.json";
    let text = JSON.stringify(sitNav);
    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.download = filename;
    //link.innerHTML = "Download File";
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }, 100);
  };

  return saveFile;
};

export default SaveToFile();
