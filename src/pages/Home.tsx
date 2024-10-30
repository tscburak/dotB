import {
    Button,
    Center,
    Divider,
    FileInput,
    Image,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import logo from "../../public/logo1.svg";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string>();

  function submitHandler() {
    if (!file) {
      return;
    }
    console.log(file);

    const reader = new FileReader();

    reader.onload = function (event) {
      // Read the file as an ArrayBuffer
      const arrayBuffer = event.target!.result;
      const byteArray = new Uint8Array(arrayBuffer as ArrayBuffer);

      // Convert the byte array to a hex string
      let hexString = Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      // Replace occurrences of the hex string
      hexString = hexString.replace(/ffff0f00/g, "00009002");

      // Convert back to a byte array (modified)
      const modifiedByteArray = new Uint8Array(
        hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
      );

      // Create a new byte array to hold modified data without the old checksum
      const finalByteArray = new Uint8Array(modifiedByteArray.length); // Prepare final array
      finalByteArray.set(
        modifiedByteArray.subarray(0, modifiedByteArray.length - 4)
      ); // Copy all but the old checksum

      // Calculate the new checksum based on the modified data (excluding the last 4 bytes)
      let checksum = 0;
      for (let i = 0; i < finalByteArray.length; i++) {
        checksum += finalByteArray[i];
      }
      checksum = checksum >>> 0; // Ensure checksum is a 32-bit unsigned integer

      // Append the new checksum as the last four bytes
      finalByteArray.set(
        new Uint8Array(new Uint32Array([checksum]).buffer),
        finalByteArray.length - 4
      );

      // Create a new Blob and download it
      const blob = new Blob([finalByteArray], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      setOutput(url);
    };

    reader.onerror = function () {
      notifications.show({
        title: "Error Occured",
        message: "an Error occured. Let us wait and try again later.",
        color: "red",
      });
    };

    reader.readAsArrayBuffer(file);
  }

  function uploadHandler(file: File | null) {
    if (output) {
      setOutput("");
    }
    setFile(file);
  }

  return (
    <Center h={"100vh"} p={"xl"}>
      <Stack h={"100vh"} align="center" w={500}>
        <Image src={logo} w={300} />
        <Stack pb={"xl"}>
          <Title c={"var(--mantine-color-pink-5)"} order={3}>Welcome to dotB - Vice City Save File Editor!</Title>
          <Text>
            Are you stuck in chaos after activating the FIGHTFIGHTFIGHT cheat in
            GTA Vice City?
            <br />
            <br />
            With dotB, you can easily edit your save file (GTAVCsfX.b) to
            deactivate the cheat and regain control of your game. Just upload
            your save file, and dotB will help you reactivate your game.
            <br />
            <br />
            We recommend downloading the modified file to a different slot to
            avoid losing any data. Please remember to keep backups, as crashes
            may happen unexpectedly. Get back to enjoying Vice City with dotB!
          </Text>
        </Stack>
        <Stack>
          <FileInput
            onChange={uploadHandler}
            clearable
            accept=".b"
            label="Upload your .b file"
            description="Locate your GTA Vice City files and find your save files. if your save slot is 1 then the file may looks like: GTAVCsf1.b "
            placeholder="GTAVCsf1.b"
          />
          <Button disabled={!file} onClick={submitHandler}>
            Submit
          </Button>
          {output && (
            <Stack>
              <Divider label="Click the slot that you want to play on" />

              <SimpleGrid cols={4}>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Button
                      variant="outline"
                      key={`button_${i}`}
                      component="a"
                      href={output}
                      download={`GTAVCsf${i + 1}.b`}
                    >
                      Slot {i + 1}
                    </Button>
                  ))}
              </SimpleGrid>
            </Stack>
          )}
        </Stack>
        <Text mt={"auto"} p={"xl"}>Developed and designed by <a target="_blank" style={{color:"var(--mantine-color-purple-5)"}}  href="https://tscburak.dev">tscburak</a> -  <a  target="_blank" href="https://github.com/tscburak/dotB" style={{color:"var(--mantine-color-purple-5)"}}>Source Code</a></Text>
      </Stack>
    </Center>
  );
}
