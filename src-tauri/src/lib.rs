// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::PathBuf;
use tauri::command;
use serde::Serialize;

#[derive(Serialize)]
pub struct FileInfo {
  name: String,
  is_dir: bool,
}

#[command]
fn read_directory(path: String) -> Result<Vec<FileInfo>, String> {
  let entries = fs::read_dir(PathBuf::from(path))
    .map_err(|e| e.to_string())?;

  let mut files = Vec::new();

  for entry in entries {
    let entry = entry.map_err(|e| e.to_string())?;
    let metadata = entry.metadata().map_err(|e| e.to_string())?;
    let file_name = entry.file_name().into_string().unwrap_or_default();

    files.push(FileInfo {
      name: file_name,
      is_dir: metadata.is_dir(),
    });
  }

  Ok(files)
}

#[command]
fn read_file_content(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_directory, read_file_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
