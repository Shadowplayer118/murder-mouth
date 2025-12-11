// import React from "react";
// import { TeamContainer } from "./TeamContainer";
// import { Player } from "./types"; // ✅ Import the type from your types file

// type TeamManagerProps = {
//   characters: Player[]; // replaced TeamMember with Player
//   teamACoords: string[];
//   teamBCoords: string[];
//   teamAMembers: (Player | null)[];
//   setTeamAMembers: React.Dispatch<React.SetStateAction<(Player | null)[]>>;
//   teamBMembers: (Player | null)[];
//   setTeamBMembers: React.Dispatch<React.SetStateAction<(Player | null)[]>>;
// };

// export default function TeamManager({
//   characters,
//   teamACoords,
//   teamBCoords,
//   teamAMembers,
//   setTeamAMembers,
//   teamBMembers,
//   setTeamBMembers,
// }: TeamManagerProps) {
//   return (
//     <div className="w-full flex flex-col items-center">
//       <TeamContainer
//         teamName="Team A"
//         coords={teamACoords}
//         selectedMembers={teamAMembers}
//         onChangeMember={(i, m) =>
//           setTeamAMembers(prev => {
//             const copy = [...prev];
//             copy[i] = m;
//             return copy;
//           })
//         }
//         color="blue"
//         characters={characters}
//       />
//       <TeamContainer
//         teamName="Team B"
//         coords={teamBCoords}
//         selectedMembers={teamBMembers}
//         onChangeMember={(i, m) =>
//           setTeamBMembers(prev => {
//             const copy = [...prev];
//             copy[i] = m;
//             return copy;
//           })
//         }
//         color="red"
//         characters={characters}
//       />
//     </div>
//   );
// }
