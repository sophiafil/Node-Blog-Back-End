export class Post {
    postId:number = 0;
    createdDate:any=new Date();
    title:string='';
    content:string='';
    userId:string='';
    headerImage:string='';
    lastUpdated: any = new Date();

    constructor(postId:number, createdDate:Date, title:string, content:string, userId:string, headerImage:string, lastUpdated:Date)
    {
        this.postId=postId;
        this.createdDate=createdDate;
        this.title=title;
        this.content=content;
        this.userId=userId;
        this.headerImage=headerImage;
        this.lastUpdated=lastUpdated;
    }

    CompletePost()
    {
        if(this.title.length > 0 && this.content.length > 0 && this.headerImage.length > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}