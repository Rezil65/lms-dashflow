
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Download, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { UserFormValues } from "./UserAddModal";

interface UserBulkImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersImported: (users: UserFormValues[]) => void;
}

const UserBulkImportModal = ({
  open,
  onOpenChange,
  onUsersImported,
}: UserBulkImportModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<{
    success: number;
    errors: Array<{ row: number; error: string }>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setUploadError(null);
    setImportSummary(null);
  };

  const downloadTemplate = () => {
    // In a real app, this would generate and download a CSV/XLS template
    // Mock implementation for demo purposes
    const templateContent = "Name,Email,Role,Status,Group\nJohn Doe,john@example.com,Student,Active,College A\nJane Smith,jane@example.com,Instructor,Active,Web Development";
    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Template downloaded successfully");
  };

  const processFile = () => {
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv" && fileExtension !== "xls" && fileExtension !== "xlsx") {
      setUploadError("Only CSV, XLS, or XLSX files are supported");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // In a real app, this would parse the file and validate its contents
    // Mock implementation for demo purposes
    setTimeout(() => {
      // Mock data for demonstration
      const mockImportedUsers: UserFormValues[] = [
        {
          name: "John Doe",
          email: "john@example.com",
          role: "Student",
          status: "Active",
          group: "1" // College A
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Instructor",
          status: "Active",
          group: "2" // Web Development
        }
      ];

      // Mock import summary
      const mockSummary = {
        success: 2,
        errors: [
          { row: 3, error: "Invalid email format for 'bob@invalid'" },
        ],
      };

      setImportSummary(mockSummary);
      onUsersImported(mockImportedUsers);
      setIsUploading(false);
    }, 1500);
  };

  const resetForm = () => {
    setFile(null);
    setUploadError(null);
    setImportSummary(null);
  };

  const closeModal = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV or XLS file to add multiple users at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={downloadTemplate}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          {!importSummary ? (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  uploadError ? "border-red-400" : "border-border"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground mb-1">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    CSV, XLS, or XLSX (max 10MB)
                  </span>
                </label>
              </div>

              {uploadError && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {uploadError}
                </div>
              )}
            </>
          ) : (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Import Summary</h3>
              <div className="text-sm mb-4 flex gap-1 items-center text-green-600">
                <Check className="h-4 w-4" />
                <span>{importSummary.success} users imported successfully</span>
              </div>

              {importSummary.errors.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-red-500 mb-2">Errors</h4>
                  <ul className="text-sm space-y-1">
                    {importSummary.errors.map((error, index) => (
                      <li key={index} className="flex gap-1 text-red-500">
                        <X className="h-4 w-4 flex-shrink-0" />
                        <span>
                          Row {error.row}: {error.error}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {importSummary ? (
            <Button onClick={closeModal}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                onClick={processFile}
                disabled={!file || isUploading}
              >
                {isUploading ? "Processing..." : "Import Users"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserBulkImportModal;
