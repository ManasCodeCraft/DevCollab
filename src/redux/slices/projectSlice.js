import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentWorkingDirectory: null,
  currentProject: null,
  dirStack: [],
  currentlyOpenedFile: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({ 
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action){
      state.projects = [...action.payload];
      state.loading = false;
      state.error = null;
    },
    setProjectHostedAndRunning(state, action){
      let id = action.payload
      for(let project of state.projects){
         if(project.projectId === id){
             project.isDeployed = true
             project.isRunning = true;
             state.currentProject = project;
             break;
         }
      }
    },
    setRunningDisable(state, action){
      let id = action.payload;
      for(let project of state.projects){
        if(project.projectId === id){
          project.isRunning = false;
          break;
        }
      }

      state.currentProject.isRunning = false;

      for(let dir of state.dirStack){
        if(dir.projectId){
            dir.isRunning = false;
            break;
        }
     }
    },
    setRunningEnable(state, action){
      let id = action.payload;
      for(let project of state.projects){
        if(project.projectId === id){
          project.isRunning = true;
          state.currentProject = project;
          break;
        }
      }

      for(let dir of state.dirStack){
        if(dir.projectId){
            dir = state.currentProject;
            break;
        }
     }
    },
    setProjectLogs(state, action){
       let id = action.payload.id;
       let logs = action.payload.logs;
       for(let project of state.projects){
         if(project.projectId === id){
           project.logs = logs;
           state.currentProject = project;
           break
         }
       }

       for(let dir of state.dirStack){
        if(dir.projectId){
            dir = state.currentProject;
            break;
        }
     }

    },
    setProjectNewName(state, action){
       let id = action.payload.id 
       let newName = action.payload.newName;
       for (let project of state.projects){
         if (project.projectId === id){
           project.projectName = newName;
         }
       }
    },
    setDirectoryNewName(state, action){
       let id = action.payload.id 
       let newName = action.payload.newName;
       let dirs = state.currentWorkingDirectory.directories
       for(let dir of dirs){
          if (dir.dirId === id){
            dir.dirName = newName;
            break;
          }
       }

       state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory

    },
    setFileNewName(state, action){
       let id = action.payload.id 
       let newName = action.payload.newName;
       let files = state.currentWorkingDirectory.files
       for(let file of files){
          if (file.fileId === id){
            file.fileName = newName;
            break;
          }
       }

       state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory

    },

    setFileContent(state, action){
       var id = action.payload.id;
       var content = action.payload.content;
       var file = state.currentlyOpenedFile;
       file.content = content;
    },
    
    createNewProject(state, action){
       state.projects.push(action.payload);
    },
    replaceExistingProject(state, action){
       let id = action.payload.id;
       for (let project of state.projects){
         if (project.projectId === id){
           project = action.payload.newProject;
         }
       }
    },
    addFile(state, action){
       state.currentWorkingDirectory.files.push(action.payload);
       state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;

       if(!state.currentWorkingDirectory.id){
           state.currentProject.files.push(action.payload)
       }
    },
    addFolder(state, action){
       state.currentWorkingDirectory.directories.push(action.payload);
       state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;
       if(!state.currentWorkingDirectory.id){
           state.currentProject.directories.push(action.payload)
      }
    },
    setCurrentProject(state,action){
      state.currentProject = action.payload;
    },
    setCurrentWorkingDirectory(state,action){
      state.currentWorkingDirectory = action.payload;
    },
    pushDirStack(state,action){
      state.dirStack.push(action.payload);
      state.currentWorkingDirectory = action.payload;
    },
    popDirStack(state){
      state.dirStack.pop();
      state.currentWorkingDirectory = state.dirStack[state.dirStack.length - 1];
    },
    popUptoIndexDirStack(state,action){
      state.dirStack = state.dirStack.slice(0,action.payload+1);
      state.currentWorkingDirectory = state.dirStack[state.dirStack.length - 1];
    },
    popAllDirStack(state){
      state.dirStack = [];
      state.currentWorkingDirectory= null;
    },
    setCurrentlyOpenedFile(state,action){
      state.currentlyOpenedFile = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    deleteProjectById(state, action) {
      let id = action.payload; 
      for(let project of state.projects){
         if(project.projectId === id){
            state.projects =  state.projects.filter(project => project.projectId !== id)
            break;
         }
      }
      state.loading = false;
      state.error = null;
    },
    deleteDirectoryById(state, action){
      let id = action.payload;
      state.currentWorkingDirectory.directories =  state.currentWorkingDirectory.directories.filter(dir => dir.dirId !== id)
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory

      if(!state.currentWorkingDirectory.id){
          state.currentProject = state.currentWorkingDirectory
      }


    },
    deleteFileById(state, action){
      let id = action.payload;
      state.currentWorkingDirectory.files =  state.currentWorkingDirectory.files.filter(file => file.fileId !== id)
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory

      if(!state.currentWorkingDirectory.id){
          state.currentProject = state.currentWorkingDirectory
      }
 
    },
  },
});

export const {setFileContent, setProjectLogs, setRunningEnable, setRunningDisable, setProjectHostedAndRunning, setFileNewName ,deleteFileById ,deleteDirectoryById ,setDirectoryNewName ,addFolder, addFile, replaceExistingProject ,createNewProject ,setProjectNewName, setCurrentlyOpenedFile ,setCurrentWorkingDirectory, setCurrentProject, setProjects, pushDirStack, popDirStack, popAllDirStack, popUptoIndexDirStack, setLoading, setError, deleteProjectById } = projectSlice.actions;
export default projectSlice.reducer;
