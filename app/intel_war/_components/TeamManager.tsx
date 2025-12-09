import React from "react";
import { TeamContainer } from "./TeamContainer";

type TeamManagerProps = {
  characters: TeamMember[];
  teamACoords: string[];
  teamBCoords: string[];
  teamAMembers: (TeamMember | null)[];
  setTeamAMembers: React.Dispatch<React.SetStateAction<(TeamMember | null)[]>>;
  teamBMembers: (TeamMember | null)[];
  setTeamBMembers: React.Dispatch<React.SetStateAction<(TeamMember | null)[]>>;
};

export default function TeamManager({ characters, teamACoords, teamBCoords, teamAMembers, setTeamAMembers, teamBMembers, setTeamBMembers }: TeamManagerProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <TeamContainer
        teamName="Team A"
        coords={teamACoords}
        selectedMembers={teamAMembers}
        onChangeMember={(i, m) => setTeamAMembers(prev => { const copy = [...prev]; copy[i] = m; return copy; })}
        color="blue"
        characters={characters}
      />
      <TeamContainer
        teamName="Team B"
        coords={teamBCoords}
        selectedMembers={teamBMembers}
        onChangeMember={(i, m) => setTeamBMembers(prev => { const copy = [...prev]; copy[i] = m; return copy; })}
        color="red"
        characters={characters}
      />
    </div>
  );
}
