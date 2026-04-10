import React, { useState } from 'react';
import { Button, Input, Textarea } from '@windmill/react-ui';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import CMSImageUploader from './CMSImageUploader';

const DynamicTeamManager = ({ members = [], onChange }) => {
  const [newMember, setNewMember] = useState({ name: '', position: '', bio: '', photo: '' });

  const handleAddMember = () => {
    if (newMember.name.trim()) {
      onChange([...members, { ...newMember, id: Date.now() }]);
      setNewMember({ name: '', position: '', bio: '', photo: '' });
    }
  };

  const handleUpdateMember = (index, field, value) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveMember = (index) => {
    onChange(members.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <div key={member.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <Input
                type="text"
                placeholder="e.g., John Doe"
                value={member.name || ''}
                onChange={(e) => handleUpdateMember(index, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <Input
                type="text"
                placeholder="e.g., CEO & Founder"
                value={member.position || ''}
                onChange={(e) => handleUpdateMember(index, 'position', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Photo
            </label>
            <CMSImageUploader
              imageUrl={member.photo || ''}
              setImageUrl={(url) => handleUpdateMember(index, 'photo', url)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <Textarea
              placeholder="Brief bio about this team member..."
              value={member.bio || ''}
              onChange={(e) => handleUpdateMember(index, 'bio', e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => handleRemoveMember(index)}
              layout="outline"
              size="small"
              className="text-red-500 border-red-300 hover:bg-red-50"
            >
              <FiTrash2 className="mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ))}

      {/* Add new member form */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Add New Team Member</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <Input
              type="text"
              placeholder="e.g., John Doe"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position
            </label>
            <Input
              type="text"
              placeholder="e.g., CEO & Founder"
              value={newMember.position}
              onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Photo
          </label>
          <CMSImageUploader
            imageUrl={newMember.photo}
            setImageUrl={(url) => setNewMember({ ...newMember, photo: url })}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <Textarea
            placeholder="Brief bio about this team member..."
            value={newMember.bio}
            onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
            rows={3}
            className="w-full"
          />
        </div>
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleAddMember}
            disabled={!newMember.name.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicTeamManager;
