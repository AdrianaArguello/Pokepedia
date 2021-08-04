/**
 * @param Grid : models data
 * @returns {DownloadResources} : utils for generate resources
 */
const FetchTest = (

  function(Grid){
    /**
     * 
     * @param {*} filename : name
     * @param {*} text     : Content 
     * @returns void
     */
    function download(filename, text) {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename + '.txt');

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    /**
     * Download resources into txt files for download with wget
     * @return void
     */
    function DownloadResources(){
      const pngs =  (Grid.results.map( png => png.png )).join("\n");
      const svgs =  (Grid.results.map( svg => svg.svg )).join("\n");

      download('pngs',pngs);
      download('svgs',svgs);
      
    }
    return {DownloadResources}
  }

)(Grid);

