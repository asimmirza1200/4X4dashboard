import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Label,
  Textarea,
} from "@windmill/react-ui";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiTrash2, FiArrowLeft } from "react-icons/fi";

import useAsync from "@/hooks/useAsync";
import CBSGServices from "@/services/CBSGServices";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";

const CBSGBuildDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [reason, setReason] = useState("");

  // Fetch build details
  const { data, loading, error } = useAsync(() =>
    CBSGServices.getBuildById(id)
  );

  const build = data;

  // Approve/Reject build
  const handleApproveBuild = async (approved) => {
    try {
      await CBSGServices.approveBuild(id, {
        approved,
        reason: reason || (approved ? "Build approved" : "Build rejected"),
      });
      toast.success(`Build ${approved ? "approved" : "rejected"} successfully`);
      history.push("/cbsg/builds");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update build");
    }
  };

  // Delete build
  const handleDeleteBuild = async () => {
    if (window.confirm("Are you sure you want to delete this build?")) {
      try {
        await CBSGServices.deleteBuild(id);
        toast.success("Build deleted successfully");
        history.push("/cbsg/builds");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete build");
      }
    }
  };

  if (loading) {
    return (
      <>
        <PageTitle>CBSG - Build Detail</PageTitle>
        <TableLoading />
      </>
    );
  }

  if (error || !build) {
    return (
      <>
        <PageTitle>CBSG - Build Detail</PageTitle>
        <Card>
          <CardBody>
            <span className="text-center text-xl text-red-500">
              {error?.message || "Build not found"}
            </span>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle>CBSG - Build Detail</PageTitle>

      <AnimatedContent>
        <div className="mb-4">
          <Button
            layout="link"
            onClick={() => history.push("/cbsg/builds")}
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Builds
          </Button>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Build Info */}
          <Card>
            <CardBody>
              <h2 className="text-2xl font-semibold mb-4">{build.name}</h2>
              
              <div className="space-y-3">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge type={build.approved ? "success" : "warning"}>
                      {build.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Visibility</Label>
                  <div className="mt-1">
                    <Badge type={build.visibility === "public" ? "primary" : "neutral"}>
                      {build.visibility}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Owner</Label>
                  <div className="mt-1">
                    {build.user_id?.name || "Unknown"}
                    {build.user_id?.handle && (
                      <span className="text-gray-500 ml-2">
                        @{build.user_id.handle}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Likes</Label>
                  <div className="mt-1">{build.likesCount || 0}</div>
                </div>

                <div>
                  <Label>Created</Label>
                  <div className="mt-1">
                    {new Date(build.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Vehicle Specs */}
          {build.specs && (
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4">Vehicle Specifications</h3>
                <div className="space-y-2">
                  {build.specs.make && (
                    <div>
                      <span className="font-medium">Make:</span> {build.specs.make}
                    </div>
                  )}
                  {build.specs.model && (
                    <div>
                      <span className="font-medium">Model:</span> {build.specs.model}
                    </div>
                  )}
                  {build.specs.year && (
                    <div>
                      <span className="font-medium">Year:</span> {build.specs.year}
                    </div>
                  )}
                  {build.specs.series && (
                    <div>
                      <span className="font-medium">Series:</span> {build.specs.series}
                    </div>
                  )}
                  {build.specs.engine && (
                    <div>
                      <span className="font-medium">Engine:</span> {build.specs.engine}
                    </div>
                  )}
                  {build.specs.transmission && (
                    <div>
                      <span className="font-medium">Transmission:</span> {build.specs.transmission}
                    </div>
                  )}
                  {build.specs.drivetrain && (
                    <div>
                      <span className="font-medium">Drivetrain:</span> {build.specs.drivetrain}
                    </div>
                  )}
                  {build.specs.color && (
                    <div>
                      <span className="font-medium">Color:</span> {build.specs.color}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Description */}
        {build.description && (
          <Card className="mb-8">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">{build.description}</p>
            </CardBody>
          </Card>
        )}

        {/* Tags */}
        {build.tags && build.tags.length > 0 && (
          <Card className="mb-8">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {build.tags.map((tag, index) => (
                  <Badge key={index} type="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Images */}
        {(build.hero_image_url || (build.media_urls && build.media_urls.length > 0)) && (
          <Card className="mb-8">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {build.hero_image_url && (
                  <img
                    src={build.hero_image_url}
                    alt={build.name}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                {build.media_urls?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${build.name} ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Approval Actions */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Moderation Actions</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Reason (Optional)</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for approval/rejection..."
                />
              </div>

              <div className="flex gap-4">
                {!build.approved && (
                  <Button
                    onClick={() => handleApproveBuild(true)}
                    className="bg-green-600"
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Approve Build
                  </Button>
                )}
                {build.approved && (
                  <Button
                    onClick={() => handleApproveBuild(false)}
                    className="bg-yellow-600"
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Reject Build
                  </Button>
                )}
                <Button
                  onClick={handleDeleteBuild}
                  className="bg-red-600"
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete Build
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default CBSGBuildDetail;

