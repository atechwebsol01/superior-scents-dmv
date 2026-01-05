import React from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Star } from 'lucide-react';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import type { CustomerContact } from '../types/servicePeriod.types';

interface ContactsTabProps {
  contacts: CustomerContact[];
  isLoading: boolean;
  onAdd: (data: Omit<CustomerContact, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onEdit: (id: string, data: Partial<CustomerContact>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<CustomerContact | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    isPrimary: false,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormData({ name: '', title: '', email: '', phone: '', isPrimary: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: CustomerContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      title: contact.title || '',
      email: contact.email || '',
      phone: contact.phone || '',
      isPrimary: contact.isPrimary,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingContact) {
        await onEdit(editingContact.id, formData);
      } else {
        await onAdd(formData);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contact: CustomerContact) => {
    if (window.confirm(`Delete contact "${contact.name}"?`)) {
      await onDelete(contact.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Contacts ({contacts.length})
        </h3>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
        >
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              No contacts added yet.
            </p>
            <Button variant="outline" onClick={handleOpenAdd}>
              Add First Contact
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="card-hover">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <Badge variant="primary">
                        <Star className="w-3 h-3 mr-1" /> Primary
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                    >
                      <Edit className="w-4 h-4 text-neutral-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact)}
                      className="p-1.5 hover:bg-error-50 dark:hover:bg-error-900/30 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-error-500" />
                    </button>
                  </div>
                </div>

                {contact.title && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    {contact.title}
                  </p>
                )}

                <div className="space-y-2">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      <Phone className="w-4 h-4" />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Manager, Owner"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Primary Contact</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactsTab;
