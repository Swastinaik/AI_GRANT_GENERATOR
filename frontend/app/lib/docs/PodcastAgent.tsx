import { Mic } from "lucide-react";

export const PodcastAgent = {
  slug: "podcast-agent",
  name: "Podcast Generation Agent",
  description:
    "Generate natural, human-like podcasts from prompts or topics using AI-powered script writing and speech synthesis.",
  icon: <Mic className="h-5 w-5" />,
  sections: [

    // -------------------- OVERVIEW --------------------
    {
      id: "overview",
      title: "Overview",
      content: (
        <>
          <p>
            The Podcast Generation Agent enables users to create engaging,
            human-like podcasts using AI. Users provide a topic or prompt, and
            the agent generates a complete podcast including a structured
            transcript and realistic voice narration.
          </p>

          <p>
            This agent is designed for content creators, educators, marketers,
            and storytellers who want to produce high-quality audio content
            without manual scripting or recording.
          </p>
        </>
      ),
    },

    // -------------------- PROBLEM --------------------
    {
      id: "problem",
      title: "Problem This Agent Solves",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Podcast creation requires scripting, recording, and editing</li>
          <li>High-quality voice production needs professional equipment</li>
          <li>Manual workflows are time-consuming and costly</li>
          <li>Scaling podcast content is difficult</li>
        </ul>
      ),
    },

    // -------------------- SOLUTION --------------------
    {
      id: "solution",
      title: "Solution Approach",
      content: (
        <>
          <p>
            The Podcast Generation Agent automates the entire podcast creation
            pipeline — from topic ideation to final audio output — using AI.
          </p>

          <p>
            It generates a natural conversational script and converts it into a
            realistic audio experience using advanced text-to-speech models.
          </p>
        </>
      ),
    },

    // -------------------- USER INPUT --------------------
    {
      id: "user-input",
      title: "User Inputs",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Podcast topic or prompt</li>
          <li>Optional tone or style preference</li>
          <li>Optional duration or format guidance</li>
        </ul>
      ),
    },

    // -------------------- TRANSCRIPT GENERATION --------------------
    {
      id: "transcript",
      title: "Transcript Generation",
      content: (
        <>
          <p>
            Based on the user’s input, the agent generates a well-structured
            podcast transcript that includes:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Introduction and context setting</li>
            <li>Main discussion points</li>
            <li>Smooth transitions between segments</li>
            <li>Conclusion and closing remarks</li>
          </ul>

          <p>
            The transcript is designed to sound natural when spoken, not robotic
            or overly formal.
          </p>
        </>
      ),
    },

    // -------------------- VOICE SYNTHESIS --------------------
    {
      id: "voice-synthesis",
      title: "Human-like Voice Generation",
      content: (
        <>
          <p>
            The generated transcript is converted into audio using advanced
            text-to-speech models that produce expressive, human-like voices.
          </p>

          <p>
            These voices include natural pacing, emphasis, and pauses to create
            an authentic podcast listening experience.
          </p>
        </>
      ),
    },

    // -------------------- AUDIO PIPELINE --------------------
    {
      id: "audio-pipeline",
      title: "Audio Generation Pipeline",
      content: (
        <ol className="list-decimal pl-6 space-y-3">
          <li>User submits topic or prompt</li>
          <li>AI generates structured transcript</li>
          <li>Transcript is segmented for narration</li>
          <li>Audio is synthesized per segment</li>
          <li>Segments are combined into a final podcast</li>
        </ol>
      ),
    },

    // -------------------- STREAMING --------------------
    {
      id: "streaming",
      title: "Streaming & Playback",
      content: (
        <>
          <p>
            Generated podcasts can be streamed directly within the application
            using a built-in audio player.
          </p>

          <p>
            Streaming allows users to preview content immediately without
            downloading files.
          </p>
        </>
      ),
    },

    // -------------------- DOWNLOAD --------------------
    {
      id: "download",
      title: "Download Options",
      content: (
        <>
          <p>
            Users can download the generated podcast as an audio file for
            offline use or distribution.
          </p>

          <p>
            This enables publishing across platforms such as Spotify, Apple
            Podcasts, or internal knowledge systems.
          </p>
        </>
      ),
    },

    // -------------------- EDITING --------------------
    {
      id: "editing",
      title: "Transcript Editing",
      content: (
        <>
          <p>
            Users can review and edit the generated transcript before final
            audio generation to refine tone, pacing, or content accuracy.
          </p>

          <p>
            This ensures creative control while benefiting from AI automation.
          </p>
        </>
      ),
    },

    // -------------------- USE CASES --------------------
    {
      id: "use-cases",
      title: "Common Use Cases",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Educational podcasts</li>
          <li>News and commentary</li>
          <li>Storytelling and narration</li>
          <li>Marketing and brand podcasts</li>
        </ul>
      ),
    },

    // -------------------- BEST PRACTICES --------------------
    {
      id: "best-practices",
      title: "Best Practices",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide clear and focused topics</li>
          <li>Review transcripts before audio generation</li>
          <li>Use concise prompts for better narration flow</li>
          <li>Preview audio before downloading</li>
        </ul>
      ),
    },

    // -------------------- LIMITATIONS --------------------
    {
      id: "limitations",
      title: "Limitations",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Voice styles may vary slightly across generations</li>
          <li>Highly emotional content may require manual refinement</li>
          <li>Generated audio is not a replacement for live interviews</li>
        </ul>
      ),
    },

    // -------------------- SECURITY --------------------
    {
      id: "security",
      title: "Security & Data Handling",
      content: (
        <p>
          All user inputs and generated audio are processed securely. Data is
          handled according to strict access and storage policies to protect
          user privacy.
        </p>
      ),
    },

    // -------------------- NEXT STEPS --------------------
    {
      id: "next-steps",
      title: "Next Steps",
      content: (
        <p>
          After generating a podcast, users can download, share, or iterate on
          new topics to build a consistent content pipeline.
        </p>
      ),
    },
  ],
}
