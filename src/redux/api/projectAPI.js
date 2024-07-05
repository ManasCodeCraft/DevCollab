import {
  setProjects,
  setLoading,
  setError,
  deleteProject,
  setCurrentProject,
  pushDirStack,
  popDirStack,
} from "../slices/projectSlice";
export function getAllProjects(dispatch) {
  dispatch(setLoading(true));
  fetch("/project/get-all", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => {
      dispatch(setLoading(false));
      return response.json();
    })
    .then((data) => {
      if (data.projects) {
        dispatch(setProjects(data.projects));
      }
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(setError(error.message));
      console.log(error);
    });
}


export async function getDirectory(dispatch, id) {
  dispatch(setLoading(true));
  try {
    const response = await fetch(
      "/directory/get-content",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );

    dispatch(setLoading(false));

    const data = await response.json();

    if (data) {
      dispatch(pushDirStack(data));
    }
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    console.log(error);
  }

}


export async function refreshDirectory(dispatch, id) {
  dispatch(setLoading(true));
  try {
    const response = await fetch(
      "/directory/get-content",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );

    dispatch(setLoading(false));

    const data = await response.json();

    if (data) {
      dispatch(popDirStack())
      dispatch(pushDirStack(data));
    }
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.message));
    console.log(error);
  }
}
