v20.0.0
### Breaking

- Drop MIME-type and extension enumeration in types (#693)  0ff11c6
- Remove `NodeFileTypeParser` in favor of using `FileTypeParser` on all platforms (#707)  ff8eed8

### Improvements

- Give API access to `FileTypeParser#detectors` (#704)  7e72bbc
- Improve Nikon RAW NEF (Tiff) format detection (#670)  cf6fc1e
- Add support for Java archive (`.jar`) (#719)  8651809
- Add support for MSOffice macro-enabled docs and templates (#720)  7fe5667
- Add support for OpenDocument graphics and templates (#718)  4db407d
- Add support for Microsoft Excel template with macros (.xltm) (#714)  1fe621a
- Add support for Microsoft Word template (.dotx) (#713)  643ef78
- Add support for Microsoft Excel template (`.xltx`) (#712)  0dab3e0
- Add support for Microsoft PowerPoint template ( `.potx`) (#710)  f978619
- Add support for ZIP decompression using `@tokenizer/inflate` (#695)  399b0f1
- Add support for `.lz4` file format (#706)  74acf94
- Add support for format `.drc`, Google&#39;s Draco 3D Data Compression (#702)  e99257d

### Fixes

- Fix code sequence &quot;File Type Box&quot; detection (#705)  7d4dd8d

---

https://github.com/sindresorhus/file-type/compare/v19.6.0...v20.0.0