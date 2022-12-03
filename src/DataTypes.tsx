import { type } from "@testing-library/user-event/dist/type";
import React from "react";
// interface Record{
    
// }
export const templateDictionary: { [x: string]: any } = {};
export type Record =  {
        SiteNavigationId: string,
        Name: string,
        ParentNavigationId: string,
        TemplateId: number
    }

   
 

    export type Cell = 
    {
        type?: string,
        source?: {id:string},
        target?: {id:string},
        connector?: {name:string},
        id: string,
        z: number,
        vertices?: any[],
        siblingRank?:number,
        position?:{x:number,y:number},
        size?:{width:number, height:number},
        attrs?:{
            body:{
                stroke: string,
                fill:string,
                rx: 5,
                ry: 5,
                cursor: string
            },
            label:{
                text:string
            }
        },
        angle?:0
    }
  export type SavedObject={
    cells:Cell[],
    template?: any
  }


  

  export type SiteNavigation={
    SiteName: string,
    Navigations:NaigationListItem[]

  }


  export type NaigationListItem={
    Navigation:Navigation
  }

  export type Navigation={
    Name:string,
    TemplateId:string|null,
    ChildNavigations:NaigationListItem[]
  } 