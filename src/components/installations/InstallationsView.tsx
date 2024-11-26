import { useState } from 'react';
import { Plus, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getStatusColor, getStatusIcon } from '@/lib/utils';
import InstallationDialog from './InstallationDialog';
import QualityCheckDialog from '../quality/QualityCheckDialog';
import DefectReportDialog from '../quality/DefectReportDialog';
import type { Installation } from '@/types';

// Mock data
const mockInstallations: Installation[] = [
  {
    id: '1',
    date: '2024-03-15',
    customerName: 'John Doe',
    vehicleInfo: '2023 Tesla Model 3',
    installer: {
      id: '1',
      name: 'Matt Anderson',
    },
    status: 'completed',
    totalArea: 125.5,
    cuts: [
      {
        id: 'c1',
        installationId: '1',
        panelName: 'Hood',
        squareFeet: 15.5,
        rollId: 'R123456',
        filmType: 'XPEL Ultimate Plus',
        status: 'completed',
        createdAt: '2024-03-15T09:00:00Z',
      },
      {
        id: 'c2',
        installationId: '1',
        panelName: 'Front Bumper',
        squareFeet: 12.0,
        rollId: 'R123457',
        filmType: 'XPEL Ultimate Plus',
        status: 'completed',
        createdAt: '2024-03-15T09:30:00Z',
      },
    ],
    notes: 'Clean installation, customer very satisfied',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
  },
  // Add more mock installations as needed
];

const getStatusBadge = (status: Installation['status']) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
      getStatusColor(status)
    )}>
      <span className="text-[10px]">{getStatusIcon(status)}</span>
      <span>
        {status === 'needs-recut'
          ? 'Needs Recut'
          : status === 'in-progress'
          ? 'In Progress'
          : 'Completed'}
      </span>
    </div>
  );
};

export default function InstallationsView() {
  const [installations, setInstallations] = useState<Installation[]>(mockInstallations);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQualityCheckDialogOpen, setIsQualityCheckDialogOpen] = useState(false);
  const [isDefectReportDialogOpen, setIsDefectReportDialogOpen] = useState(false);

  const filteredInstallations = installations.filter(
    (installation) =>
      (filterStatus === 'all' || installation.status === filterStatus) &&
      (installation.customerName.toLowerCase().includes(search.toLowerCase()) ||
        installation.vehicleInfo.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = (installation: Installation) => {
    if (selectedInstallation) {
      setInstallations(installations.map(inst => 
        inst.id === installation.id ? installation : inst
      ));
    } else {
      setInstallations([installation, ...installations]);
    }
    setIsDialogOpen(false);
    setSelectedInstallation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Installations</h1>
          <p className="text-muted-foreground">
            Track and manage PPF installations
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Installation
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search installations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="needs-recut">Needs Recut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Installer</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstallations.map((installation) => (
              <TableRow
                key={installation.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setSelectedInstallation(installation);
                  setIsDialogOpen(true);
                }}
              >
                <TableCell>
                  {new Date(installation.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{installation.customerName}</TableCell>
                <TableCell>{installation.vehicleInfo}</TableCell>
                <TableCell>{installation.installer.name}</TableCell>
                <TableCell>{installation.totalArea.toFixed(1)} ft²</TableCell>
                <TableCell>{getStatusBadge(installation.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div
                      className="cursor-pointer p-2 rounded-md hover:bg-accent/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInstallation(installation);
                        setIsQualityCheckDialogOpen(true);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                    </div>
                    <div
                      className="cursor-pointer p-2 rounded-md hover:bg-accent/50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInstallation(installation);
                        setIsDefectReportDialogOpen(true);
                      }}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InstallationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        installation={selectedInstallation}
        onSave={handleSave}
      />

      {selectedInstallation && (
        <>
          <QualityCheckDialog
            open={isQualityCheckDialogOpen}
            onOpenChange={setIsQualityCheckDialogOpen}
            installationId={selectedInstallation.id}
            onSave={(check) => {
              // Handle quality check save
              setIsQualityCheckDialogOpen(false);
            }}
          />

          <DefectReportDialog
            open={isDefectReportDialogOpen}
            onOpenChange={setIsDefectReportDialogOpen}
            installationId={selectedInstallation.id}
            onSave={(report) => {
              // Handle defect report save
              setIsDefectReportDialogOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}