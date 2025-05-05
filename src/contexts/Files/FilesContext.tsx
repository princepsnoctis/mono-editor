import { createContext } from "react";

import FilesContextType from "./FilesContextType";

const FilesContexts = createContext<FilesContextType | undefined>(undefined);

export default FilesContexts