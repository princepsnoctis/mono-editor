import { useContext } from "react";

import FilesContexts from "./FilesContext";

export const useFiles = () => {
    const context = useContext(FilesContexts);
    if (!context) throw new Error("useMessage must be used within a MessageProvider");
    return context;
};