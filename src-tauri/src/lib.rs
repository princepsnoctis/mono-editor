// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(Serialize)]
pub struct FileInfo {
    name: String,
    is_dir: bool,
}

#[command]
fn read_directory(mut path: String) -> Result<Vec<FileInfo>, String> {
    // Normalize the path: replace backslashes with forward slashes
    path = path.replace("\\", "/");

    let entries = fs::read_dir(PathBuf::from(path)).map_err(|e| e.to_string())?;

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

#[command]
fn save_to_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_file(path: String, content: String) -> Result<(), String> {
    use std::fs;
    use std::io::Write;

    let mut file = fs::File::create(&path).map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write to file: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            read_directory,
            read_file_content,
            save_to_file,
            create_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
