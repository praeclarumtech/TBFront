export interface ActiveApplicantsDataProps {
    id: number;
    aaplicantsName: string;
    technology: string;
    priority: string;
    priorityBadgeBg: string;
    operation: {
        edit:string,
        view:string,
        delete:string
    };
    commments:{
        email:string,
        feedback:string
    }
    status: string;
   
   
  }