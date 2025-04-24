import tinymce from "tinymce";
import "tinymce/icons/default/icons.min.js";
import "tinymce/themes/silver/theme.min.js";
import "tinymce/models/dom/model.min.js";
import "tinymce/skins/ui/oxide/skin.js";
import "tinymce/plugins/advlist";
import "tinymce/plugins/code";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import { Editor as TinyMceEditor } from "@tinymce/tinymce-react";
type Props = {
  value: string;
  onChange: (content: string) => void;
};
export default function Editor({ value, onChange }: Props) {
  tinymce.init({
    selector: "textarea#editor",
    plugins: "advlist code emoticons link lists table",
    toolbar: "bold italic | bullist numlist | link emoticons",
    skin_url: "default",
    content_css: "default",
  });
  return (
    <TinyMceEditor
      value={value}
      onEditorChange={(content) => onChange(content)} // send content up
      init={{
        licenseKey: "gpl",
        height: 300,
        menubar: true,
        plugins: ["advlist", "lists", "link", "code", "table", "code"],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
