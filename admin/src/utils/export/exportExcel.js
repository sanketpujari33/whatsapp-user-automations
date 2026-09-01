  import * as XLSX from 'xlsx'
  
   export const downloadExcel = async (data,name) => {
    try {
      // Fetch JSON data from API
      // Convert JSON to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      
      // Generate Excel file and download
      XLSX.writeFile(workbook, `${name}.xlsx`);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
