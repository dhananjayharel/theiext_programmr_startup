import { injectable, inject } from "inversify";
import {  MessageService, CommandService } from "@theia/core/lib/common";
import { FrontendApplicationContribution,FrontendApplication    } from "@theia/core/lib/browser";
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { TerminalWidget } from '@theia/terminal/lib/browser/base/terminal-widget';
import { TerminalWidgetFactoryOptions } from '@theia/terminal/lib/browser/terminal-widget-impl';
import { ContextKeyService } from '@theia/core/lib/browser/context-key-service';
import {ApplicationShell} from '@theia/core/lib/browser/shell/application-shell';
import {MiniBrowserOpenHandler} from '@theia/mini-browser/lib/browser/mini-browser-open-handler';
import { FileSystemWatcher } from '@theia/filesystem/lib/browser/filesystem-watcher';
import { FileSystem } from '@theia/filesystem/lib/common';
import URI from '@theia/core/lib/common/uri';
import {FileResource } from '@theia/filesystem/lib/browser/file-resource';


export const Programmr_startupCommand = {
    id: 'Programmr_startup.command',
    label: "Shows a message"
};

@injectable()
export class Programmr_startupCommandContribution implements FrontendApplicationContribution {
	
	  myIp:string;
	interval:any;
    
	  @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;
	
	//@inject(OpenerService) protected readonly openerService: OpenerService;
    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
		@inject(TerminalService) protected readonly terminalService: TerminalService,
		   @inject(ContextKeyService) protected readonly contextKeyService: ContextKeyService,
		  @inject(CommandService) protected readonly commandService: CommandService,  	
			@inject(ApplicationShell) protected readonly shell: ApplicationShell,	
			@inject(MiniBrowserOpenHandler) protected readonly miniBrowser: MiniBrowserOpenHandler,	 
		@inject(FileSystem) protected readonly fileSystem: FileSystem,
        @inject(FileSystemWatcher) protected readonly watcher: FileSystemWatcher,
    ) { 
	
	 this.contextKeyService.createKey<boolean>('explorerViewletVisible', true);
	}  
  
    async onStart(app: FrontendApplication): Promise<void> {
          console.log("onstartup");
		    this.shell.expandPanel('left');
            console.log("didnt work");			
            this.stateService.reachedState('ready').then(
                a => {
				    	console.log("reachedState");
						this.messageService.info('Running npm install...');
							//const uri = new URI("/home/ubuntu/myip.txt");
					    console.log("toggle @@@@@@@@@@@@@");
						this.shell.expandPanel('left');
						this.buildSelectedText();
						this.readFileContents();
						///this.monitorOutputUrl();
						//this.openUrlInPreview('http://54.221.1.90:4200');
						//setTimeout(()=>{
						//	console.log("open other url now");
						//this.openUrlInPreview('http://www.programmr.com');
					//},5000);
						
						// setTimeout(() => { 
						  //console.log("toggle rrrrr");	
                           //this.shell.expandPanel('left');						  
						//console.log("expanded the tree");
							//}, 1000); 
						
					    //Fire npm install
						//this.buildSelectedText();
						
				
                    	
				}
            );
       
    }
	
	async readFileContents(): Promise<void>{
			const uri = new URI("/home/ubuntu/myip.txt");
				 const resource = new FileResource(uri, this.fileSystem, this.watcher);
				let contents = await resource.readContents();
				console.log(contents);
				this.myIp = contents.trim();
					console.log("ip=123213211["+this.myIp+"]");
		       this.monitorOutputUrl();
			   this.openUrlInPreview("http://www.skillstack.com/assets/static/loading.html");
	}
	 
	monitorOutputUrl(){
		this.interval = setInterval(()=>{
			this.checkHttpStatus();
		},3000);
		
	}
	
		checkHttpStatus() {
			  const request = new XMLHttpRequest();
              var that = this;
        request.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log(this.response);
					const data = JSON.parse(this.response);
					if(data.status == '200'){
					console.log('open the url now');
					clearTimeout(that.interval);
					that.openUrlInPreview("http://"+that.myIp+":4200");					
					}
					
                } else {
                    throw(new Error('Could not fetch'));
                }
            }
        };

        request.open('GET', 'http://www.skillstack.com/api/candidates/gethttprequeststatusv2?url='+this.myIp+'&port=4200', true);
        request.send();
		
	}
	
		 async openUrlInPreview(url): Promise<void> {
					   
				     console.log("open this url"+url);
					await this.miniBrowser.openPreview(url);
					console.log("opened");

					var ss = document.getElementsByClassName("p-MenuBar-item");
					console.log("ss"+ss);
				
		 }
				 
		 
	 		
	
	 async buildSelectedText(): Promise<void> {
					    let terminal = this.terminalService.currentTerminal;
				if (!terminal) {
					terminal = <TerminalWidget>await this.terminalService.newTerminal(<TerminalWidgetFactoryOptions>{ created: new Date().toString() });
					await terminal.start();
					this.terminalService.activateTerminal(terminal);
				}
				terminal.sendText("npm start\n");  
		 
	 }	
}

