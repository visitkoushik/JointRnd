import { type } from "@testing-library/user-event/dist/type";
import React from "react";
// interface Record{
    
// }

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