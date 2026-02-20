import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Select,
  Label,
} from "@windmill/react-ui";
import { toast } from "react-toastify";

import useAsync from "@/hooks/useAsync";
import CBSGServices from "@/services/CBSGServices";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";

const CBSGSettings = () => {
  const [saving, setSaving] = useState(false);

  // Fetch current settings
  const { data, loading, error } = useAsync(() =>
    CBSGServices.getCBSGSettings()
  );

  const [enabled, setEnabled] = useState(data?.enabled ?? true);
  const [mode, setMode] = useState(data?.mode ?? "live");
  const [buildsEnabled, setBuildsEnabled] = useState(data?.builds_enabled !== false);

  // Update settings when data loads
  React.useEffect(() => {
    if (data) {
      setEnabled(data.enabled);
      setMode(data.mode);
      setBuildsEnabled(data.builds_enabled !== false);
    }
  }, [data]);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      await CBSGServices.updateCBSGSettings({
        enabled,
        mode,
        builds_enabled: buildsEnabled,
      });
      toast.success("CBSG settings updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle>CBSG - Settings</PageTitle>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <CardBody>
            {loading ? (
              <TableLoading />
            ) : error ? (
              <span className="text-center text-xl text-red-500">
                {error?.message || "Failed to load settings"}
              </span>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label>
                    <span className="text-gray-700 dark:text-gray-300">
                      CBSG Status
                    </span>
                  </Label>
                  <Select
                    className="mt-1"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="hidden">Hidden (Under Maintenance)</option>
                    <option value="staging">Staging (Testing)</option>
                    <option value="live">Live (Public)</option>
                  </Select>
                  <p className="mt-2 text-sm text-gray-500">
                    Control the visibility of the CBSG system. Hidden mode blocks all public access.
                  </p>
                </div>

                <div>
                  <Label>
                    <span className="text-gray-700 dark:text-gray-300">
                      System Enabled
                    </span>
                  </Label>
                  <Select
                    className="mt-1"
                    value={enabled ? "true" : "false"}
                    onChange={(e) => setEnabled(e.target.value === "true")}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </Select>
                  <p className="mt-2 text-sm text-gray-500">
                    Enable or disable the CBSG system entirely.
                  </p>
                </div>

                <div>
                  <Label>
                    <span className="text-gray-700 dark:text-gray-300">
                      Show builds on website
                    </span>
                  </Label>
                  <Select
                    className="mt-1"
                    value={buildsEnabled ? "true" : "false"}
                    onChange={(e) => setBuildsEnabled(e.target.value === "true")}
                  >
                    <option value="true">On – Builds and Add My Build visible</option>
                    <option value="false">Off – Hide builds module and links</option>
                  </Select>
                  <p className="mt-2 text-sm text-gray-500">
                    When on, the Builds menu, Add My Build link, and build creation are shown on the storefront. When off, they are hidden.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-700"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default CBSGSettings;

