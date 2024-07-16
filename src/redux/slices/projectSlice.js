import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  currentWorkingDirectory: null,
  currentProject: null,
  dirStack: [],
  currentlyOpenedFile: null,
  currentlyExecutingFile: {
    logs: [],
    status: 'not running',
  },
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action) {
      state.projects = [...action.payload];
      state.loading = false;
      state.error = null;
    },
    setRunningStatus(state, action) {
      let id = action.payload.projectId;
      let status = action.payload.status;
      for (let project of state.projects) {
        if (project.projectId === id) {
          project.runningStatus = status;
          break;
        }
      }

      if(state.currentProject.projectId == id){
          state.currentProject.runningStatus = status;
      }

    },
    setProjectLogs(state, action) {
      let id = action.payload.id;
      let logs = action.payload.logs;
      for (let project of state.projects) {
        if (project.projectId === id) {
          project.logs = logs;
          state.currentProject = project;
          break;
        }
      }

      for (let dir of state.dirStack) {
        if (dir.projectId) {
          dir = state.currentProject;
          break;
        }
      }
    },
    setActivityLogs(state, action) {
      let id = action.payload.id;
      let logs = action.payload.logs;
      for (let project of state.projects) {
        if (project.projectId == id) {
          project.activityLogs = logs;
          state.currentProject.activityLogs = logs;
          break;
        }
      }
    },

    addActivityLog(state, action) {
      if (!state.currentProject) {
        return;
      }
      const id = action.payload.project;
      if (state.currentProject.projectId == id) {
        state.currentProject.activityLogs.push(action.payload);
      }
    },

    pushConsoleLog(state, action) {
      const projectId = action.payload.projectId;
      const log = action.payload.log;
      for (let project of state.projects) {
        if (project.projectId == projectId) {
          project.consoleLogs = [log, ...project.consoleLogs];
        }
      }

      if (state.currentProject && state.currentProject.projectId == projectId) {
        state.currentProject.consoleLogs = [
          log,
          ...state.currentProject.consoleLogs,
        ];
      }
    },

    setProjectNewName(state, action) {
      let id = action.payload.id;
      let newName = action.payload.newName;
      for (let project of state.projects) {
        if (project.projectId === id) {
          project.projectName = newName;
        }
      }
    },
    setDirectoryNewName(state, action) {
      let id = action.payload.id;
      let newName = action.payload.newName;
      let dirs = state.currentWorkingDirectory.directories;
      for (let dir of dirs) {
        if (dir.dirId === id) {
          dir.dirName = newName;
          break;
        }
      }

      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;
    },
    setFileNewName(state, action) {
      let id = action.payload.id;
      let newName = action.payload.newName;
      let files = state.currentWorkingDirectory.files;
      for (let file of files) {
        if (file.fileId === id) {
          file.fileName = newName;
          break;
        }
      }

      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;
    },

    setFileContent(state, action) {
      var id = action.payload.id;
      var content = action.payload.content;
      var currentWorkingDirectory = state.currentWorkingDirectory;
      for (let file of currentWorkingDirectory.files) {
        if (file.fileId == id) {
          file.fileContent = content;
          break;
        }
      }
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;
      if (state.currentlyOpenedFile.fileId == id) {
        state.currentlyOpenedFile.fileContent = content;
      }
    },

    createNewProject(state, action) {
      state.projects.push(action.payload);
    },
    replaceExistingProject(state, action) {
      let id = action.payload.id;
      for (let project of state.projects) {
        if (project.projectId === id) {
          project = action.payload.newProject;
        }
      }
    },
    removeCurrentProject(state) {
      state.currentProject = null;
    },
    addFile(state, action) {
      state.currentWorkingDirectory.files.push(action.payload);
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;
    },
    addFolder(state, action) {
      state.currentWorkingDirectory.directories.push(action.payload);
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
    setCurrentWorkingDirectory(state, action) {
      state.currentWorkingDirectory = action.payload;
    },
    pushDirStack(state, action) {
      state.dirStack.push(action.payload);
      state.currentWorkingDirectory = action.payload;
    },
    popDirStack(state) {
      state.dirStack.pop();
      state.currentWorkingDirectory = state.dirStack[state.dirStack.length - 1];
    },
    popUptoIndexDirStack(state, action) {
      state.dirStack = state.dirStack.slice(0, action.payload + 1);
      state.currentWorkingDirectory = state.dirStack[state.dirStack.length - 1];
    },
    popAllDirStack(state) {
      state.dirStack = [];
      state.currentWorkingDirectory = null;
    },
    setCurrentlyOpenedFile(state, action) {
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
      for (let project of state.projects) {
        if (project.projectId === id) {
          state.projects = state.projects.filter(
            (project) => project.projectId !== id
          );
          break;
        }
      }
      state.loading = false;
      state.error = null;
    },
    deleteDirectoryById(state, action) {
      let id = action.payload;
      state.currentWorkingDirectory.directories =
        state.currentWorkingDirectory.directories.filter(
          (dir) => dir.dirId !== id
        );
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;

      if (!state.currentWorkingDirectory.id) {
        state.currentProject = state.currentWorkingDirectory;
      }
    },
    deleteFileById(state, action) {
      let id = action.payload;
      state.currentWorkingDirectory.files =
        state.currentWorkingDirectory.files.filter(
          (file) => file.fileId !== id
        );
      state.dirStack[state.dirStack.length - 1] = state.currentWorkingDirectory;

      if (!state.currentWorkingDirectory.id) {
        state.currentProject = state.currentWorkingDirectory;
      }
    },

    addNewCollab(state, action) {
      let id = action.payload.projectId;
      for (let project of state.projects) {
        if (project.projectId === id) {
          project.collaborators.push(action.payload.data);
          break;
        }
      }
      if (state.currentProject && state.currentProject.projectId === id) {
        state.currentProject.collaborators.push(action.payload.data);
      }
    },

    removeCollabById(state, action) {
      let projectId = action.payload.projectId;
      let collabId = action.payload.id;
      for (let project of state.projects) {
        if (project.projectId === projectId) {
          project.collaborators = project.collaborators.filter(
            (collab) => collab.id !== collabId
          );
          break;
        }
      }
      if (
        state.currentProject &&
        state.currentProject.projectId === projectId
      ) {
        state.currentProject.collaborators =
          state.currentProject.collaborators.filter(
            (collab) => collab.id !== collabId
          );
      }
    },

    updateActiveCollab(state, action) {
      if(!state.currentProject){
        return;
      }
      if (state.currentProject.projectId == action.payload.projectId) {
        state.currentProject.activeCollaborators = action.payload.data;
      }
    },

    setCurrentlyExecutingFile(state, action){
      let logs = state.currentlyExecutingFile.logs;

      if(!action.payload){
         state.currentlyExecutingFile = { logs, ...state.currentlyOpenedFile}
         return;
      }
      state.currentlyExecutingFile = { logs, ...action.payload};
    },

    addLogToCurrentlyExecutingFile(state, action){
      const newLogs = [action.payload.log, ...state.currentlyExecutingFile.logs];
      newLogs.sort((a, b)=> b.key - a.key);
      state.currentlyExecutingFile.logs = newLogs
    },

    setLogToCurrentlyExecutingFile(state, action){
      state.currentlyExecutingFile.logs = action.payload;
    },

    removeLogFromCurrentlyExecutingFile(state){
      state.currentlyExecutingFile.logs = [];
    },

    updateProgramStatus(state, action){
      if(typeof action.payload === 'object' && Object.keys(action.payload).includes('status')){
         state.currentlyExecutingFile.status = action.payload['status'];
         return;
      }
      state.currentlyExecutingFile.status = action.payload;
    }
  },
});

export const {
  updateProgramStatus,
  setCurrentlyExecutingFile,
  addLogToCurrentlyExecutingFile,
  setLogToCurrentlyExecutingFile,
  removeLogFromCurrentlyExecutingFile,
  incActiveCollab,
  decActiveCollab,
  pushConsoleLog,
  updateActiveCollab,
  setRunningStatus,
  addNewCollab,
  removeCollabById,
  removeCurrentProject,
  setActivityLogs,
  addActivityLog,
  setFileContent,
  setProjectLogs,
  setFileNewName,
  deleteFileById,
  deleteDirectoryById,
  setDirectoryNewName,
  addFolder,
  addFile,
  replaceExistingProject,
  createNewProject,
  setProjectNewName,
  setCurrentlyOpenedFile,
  setCurrentWorkingDirectory,
  setCurrentProject,
  setProjects,
  pushDirStack,
  popDirStack,
  popAllDirStack,
  popUptoIndexDirStack,
  setLoading,
  setError,
  deleteProjectById,
} = projectSlice.actions;
export default projectSlice.reducer;
