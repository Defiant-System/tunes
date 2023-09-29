<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sidebar">
	<div>
		<legend>
			Playlists
			<span class="btn-toggle" toggle-text="Show">Hide</span>
		</legend>
		
		<div class="list-wrapper">
			<ul>
				<xsl:for-each select="./Playlists/*">
				<li>
					<xsl:if test="position() = 2">
						<xsl:attribute name="class">active</xsl:attribute>
					</xsl:if>
					<span class="icon arrow"></span>
					<span class="icon folder"></span>
					<span class="name"><xsl:value-of select="@name"/></span>
				</li>
				</xsl:for-each>
			</ul>
		</div>
	</div>
</xsl:template>


<xsl:template name="content-list">
	<div class="playlist-info">
		<h2>Boney M - Gold</h2>
		<ul class="details">
			<li>Hakan Bilgin</li>
			<li>17 songs</li>
			<li>1 h 13 min</li>
		</ul>
	</div>
	<div class="table enum">
		<div class="row head">
			<div class="cell"></div>
			<div class="cell sort-asc">Title</div>
			<div class="cell">Artist</div>
			<div class="cell">Album</div>
			<div class="cell"><i class="icon-clock"></i></div>
		</div>
		<div class="table-body">
			<xsl:for-each select="./*">
				<div class="row">
					<xsl:attribute name="data-pos"><xsl:value-of select="position()"/></xsl:attribute>
					<div class="cell">
						<i class="icon-play"></i>
						<i class="icon-heart">
							<xsl:if test="@fav = 1">
								<xsl:attribute name="class">icon-heart-full</xsl:attribute>
							</xsl:if>
						</i>
					</div>
					<div class="cell">
						<xsl:choose>
							<xsl:when test="@title"><xsl:value-of select="@title"/></xsl:when>
							<xsl:otherwise><xsl:value-of select="@name"/></xsl:otherwise>
						</xsl:choose>
					</div>
					<div class="cell">
						<xsl:choose>
							<xsl:when test="@title"><xsl:value-of select="@artist"/></xsl:when>
							<xsl:otherwise><xsl:value-of select="../@artist"/></xsl:otherwise>
						</xsl:choose>
					</div>
					<div class="cell">
						<xsl:choose>
							<xsl:when test="@title"><xsl:value-of select="@album"/></xsl:when>
							<xsl:otherwise><xsl:value-of select="../@album"/></xsl:otherwise>
						</xsl:choose>
					</div>
					<div class="cell"><xsl:call-template name="translate-duration">
						<xsl:with-param name="ms" select="@duration" />
					</xsl:call-template></div>
				</div>
			</xsl:for-each>
		</div>
	</div>
</xsl:template>


<xsl:template name="translate-duration">
	<xsl:param name="ms"/>
	<xsl:variable name="minutes" select="floor( floor( $ms div 1000 ) div 60) mod 60"/>
	<xsl:variable name="seconds" select="round( $ms div 1000 ) mod 60"/>
	<xsl:value-of select="format-number($minutes, '0')"/>
	<xsl:value-of select="format-number($seconds, ':00')"/>
</xsl:template>

</xsl:stylesheet>