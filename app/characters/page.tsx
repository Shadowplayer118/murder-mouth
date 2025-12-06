"use client";

import { useEffect, useState } from "react";

interface Character {
  name: string;
  title: string;
  stats: {
    Int: number;
    Per: number;
    Def: number;
    Spd: number;
    Dmg: number;
  };
  lore: string;
  portrait: string;
  icon: string;
  ability: string;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    fetch("/data/characters.json") // <- change this path if needed
      .then(res => res.json())
      .then(data => setCharacters(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "15px" }}>
        Character Roster
      </h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#222", color: "#fff" }}>
            <th>Name</th>
            <th>Title</th>
            <th>Int</th>
            <th>Per</th>
            <th>Def</th>
            <th>Spd</th>
            <th>Dmg</th>
            <th>Ability</th>
            <th>Portrait</th>
          </tr>
        </thead>

        <tbody>
          {characters.map((c, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{c.name}</td>
              <td>{c.title}</td>
              <td>{c.stats.Int}</td>
              <td>{c.stats.Per}</td>
              <td>{c.stats.Def}</td>
              <td>{c.stats.Spd}</td>
              <td>{c.stats.Dmg}</td>
              <td>{c.ability}</td>
              <td>
                <img
                  src={`/images/${c.portrait}`}
                  alt={c.name}
                  width={45}
                  height={45}
                  style={{ borderRadius: "6px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
