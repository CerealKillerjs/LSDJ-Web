import React, { useState } from 'react';
import { Project, ProjectMetadata } from '../types/project';
import '../styles/ProjectManager.css';
import { demoProject } from '../demo/demoProject';

interface ProjectManagerProps {
  currentProject: Project;
  onProjectChange: (project: Project) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  currentProject,
  onProjectChange
}) => {
  const [savedProjects, setSavedProjects] = useState<ProjectMetadata[]>([]);

  const createNewProject = () => {
    const newProject: Project = {
      name: "New Project",
      version: "1.0.0",
      createdAt: new Date(),
      modifiedAt: new Date(),
      tempo: 120,
      song: {
        rows: [{
          chains: { pulse1: 0, pulse2: 0, wave: 0, noise: 0 },
          groove: 0,
          tempo: 120
        }],
        activeRow: 0,
        name: "New Song",
        tempo: 120,
        defaultGroove: 0
      },
      tables: [{
        id: 0,
        steps: Array(16).fill({
          effects: [],
          transpose: 0,
          volume: 15
        })
      }],
      chains: [{
        id: 0,
        steps: Array(16).fill({
          phraseId: 0,
          transpose: 0,
          table: 255
        })
      }],
      grooves: [{
        id: 0,
        steps: Array(4).fill({
          ticks: 6,
          volume: 15
        }),
        length: 4
      }],
      instruments: [{
        type: 'PULSE',
        envelope: {
          type: 'LINEAR',
          attack: 0,
          decay: 8,
          sustain: 15,
          release: 2
        },
        pulseWidth: 0.5,
        sweep: {
          type: 'NONE',
          speed: 0,
          intensity: 0
        },
        vibrato: {
          speed: 0,
          depth: 0,
          delay: 0
        },
        outputChannel: 'BOTH'
      }],
      phrases: [{
        id: 0,
        notes: Array(16).fill({
          note: '---',
          instrument: 0,
          volume: 15,
          effects: []
        }),
        length: 16
      }],
      kits: [],
    };

    onProjectChange(newProject);
  };

  const saveProject = () => {
    const updatedProject = {
      ...currentProject,
      modifiedAt: new Date()
    };

    // Guardar en localStorage
    localStorage.setItem(
      `lsdj-project-${currentProject.name}`,
      JSON.stringify(updatedProject)
    );

    // Actualizar lista de proyectos
    const metadata: ProjectMetadata = {
      name: updatedProject.name,
      version: updatedProject.version,
      createdAt: updatedProject.createdAt,
      modifiedAt: updatedProject.modifiedAt,
      tempo: updatedProject.tempo
    };

    setSavedProjects(prev => {
      const filtered = prev.filter(p => p.name !== metadata.name);
      return [...filtered, metadata];
    });
  };

  const loadProject = (projectName: string) => {
    const savedProject = localStorage.getItem(`lsdj-project-${projectName}`);
    if (savedProject) {
      onProjectChange(JSON.parse(savedProject));
    }
  };

  const exportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentProject.name}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target?.result as string);
          onProjectChange(project);
        } catch (error) {
          console.error('Error parsing project file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const loadDemoProject = () => {
    onProjectChange(demoProject);
  };

  return (
    <div className="project-manager">
      <div className="project-info">
        <h3>Current Project</h3>
        <div className="info-row">
          <label>Name:</label>
          <input
            type="text"
            value={currentProject.name}
            onChange={(e) => onProjectChange({
              ...currentProject,
              name: e.target.value
            })}
          />
        </div>
        <div className="info-row">
          <label>Version:</label>
          <span>{currentProject.version}</span>
        </div>
        <div className="info-row">
          <label>Modified:</label>
          <span>{currentProject.modifiedAt.toLocaleString()}</span>
        </div>
      </div>

      <div className="project-actions">
        <button onClick={createNewProject}>New Project</button>
        <button onClick={saveProject}>Save Project</button>
        <button onClick={exportProject}>Export Project</button>
        <button onClick={loadDemoProject}>Load Demo</button>
        <label className="import-button">
          Import Project
          <input
            type="file"
            accept=".json"
            onChange={importProject}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="saved-projects">
        <h3>Saved Projects</h3>
        {savedProjects.map(project => (
          <div key={project.name} className="saved-project">
            <span>{project.name}</span>
            <button onClick={() => loadProject(project.name)}>Load</button>
          </div>
        ))}
      </div>
    </div>
  );
}; 